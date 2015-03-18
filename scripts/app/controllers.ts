module ainomma.controllers {
	export class TopController{
		constructor(protected AppSettings, protected FirebaseService, protected SettingsService, protected $scope) {
			this.$scope.onRefresh = this.onRefresh;
			this.onRefresh();
		}

		onRefresh = () => {
			this.FirebaseService.getStories(this.AppSettings.topUrl, "Top", this.SettingsService.getMaxTop(), this.$scope);
		}
	}

	export class NewController {
		constructor(protected AppSettings, protected FirebaseService, protected SettingsService, protected $scope) {
			this.$scope.onRefresh = this.onRefresh;
			this.onRefresh();
		}

		onRefresh = () => {
			this.FirebaseService.getStories(this.AppSettings.newUrl, "New", this.SettingsService.getMaxNew(), this.$scope);
		}
	}

	export class AskController {
		constructor(protected AppSettings, protected FirebaseService, protected SettingsService, protected $scope) {
			this.$scope.onRefresh = this.onRefresh;
			this.onRefresh();
		}

		onRefresh = () => {
			this.FirebaseService.getStories(this.AppSettings.askUrl, "Ask HN", this.SettingsService.getMaxAsk(), this.$scope);
		}
	}

	export class ShowController {
		constructor(protected AppSettings, protected FirebaseService, protected SettingsService, protected $scope) {
			this.$scope.onRefresh = this.onRefresh;
			this.onRefresh();
		}

		onRefresh = () => {
			this.FirebaseService.getStories(this.AppSettings.showUrl, "Show HN", this.SettingsService.getMaxShow(), this.$scope);
		}
	}

	export class JobsController{
		constructor(protected AppSettings, protected FirebaseService, protected SettingsService, protected $scope) {
			this.$scope.onRefresh = this.onRefresh;
			this.onRefresh();
		}

		onRefresh = () => {
			this.FirebaseService.getStories(this.AppSettings.jobsUrl, "Jobs", this.SettingsService.getMaxJob(), this.$scope);
		}
	}

	export class UserController {
		firebase: Firebase;

		constructor(private $firebase, private $scope, private $stateParams, private $timeout, private AppSettings) {
			this.firebase = new Firebase(AppSettings.userUrl + $stateParams.userId);

			this.firebase.once("value",(user) => {
				this.$timeout(() => this.onGetUser(user));
			});
		}

		onGetUser(data) {
			var val = data.val();

			this.$scope.id = val.id;
			this.$scope.karma = val.karma;
			this.$scope.about = val.about;
		}
	}

	export class ItemController {
		firebase: Firebase;

		constructor(private $firebase, private $scope, private $stateParams, private $timeout, private AppSettings) {
			this.$scope.onRefresh = () => { this.onRefresh() };
			this.onRefresh();
		}

		onRefresh() {
			this.firebase = new Firebase(this.AppSettings.itemUrl + this.$stateParams.itemId);

			this.firebase.once("value",(item) => {
				this.$timeout(() => this.onGetItem(item));
			});

			this.$scope.$broadcast('scroll.refreshComplete');
		}

		onGetItem(data) {
			var val = data.val();

			this.$scope.title = val.title,
			this.$scope.text = val.text,
			this.$scope.by = val.by,
			this.$scope.score = val.score,
			this.$scope.description = val.description,
			this.$scope.url = val.url,
			this.$scope.comments = []

			this.getKids(val.kids, this.$scope.comments);
		}

		getKids(kids, comments) {
			if (kids) {
				kids.forEach(commentId => {
					var commentRef = new Firebase(this.AppSettings.itemUrl + commentId);
					commentRef.once("value",(item) => {
						this.$timeout(() => this.onGetComment(item, comments));
					});
				});
			}
		}

		onGetComment(comment, comments) {
			var commentData = comment.val();
			if (!commentData.deleted) {
				comments.push(commentData);
				if (commentData.kids) {
					commentData.comments = [];
					this.getKids(commentData.kids, commentData.comments);
				}
			}
		}
	}

	export class SettingsController {
		constructor(private $scope: ng.IScope, private SettingsService) {			
			this.$scope['settings'] = this.SettingsService.get();
			this.$scope.$watch('settings', (settings) => this.SettingsService.set(settings), true);
		}
	}
}

angular.module('ainomma.controllers', ['firebase', 'ionic', 'ainomma.constants', 'ainomma.services'])
	.controller('TopController', ainomma.controllers.TopController)
	.controller('NewController', ainomma.controllers.NewController)
	.controller('AskController', ainomma.controllers.AskController)
	.controller('ShowController', ainomma.controllers.ShowController)
	.controller('JobsController', ainomma.controllers.JobsController)
	.controller('UserController', ainomma.controllers.UserController)
	.controller('ItemController', ainomma.controllers.ItemController)
	.controller('SettingsController', ainomma.controllers.SettingsController);