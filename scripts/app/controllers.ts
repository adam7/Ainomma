module ainomma.controllers {
	export class TopController {
		constructor(private AppSettings, private FirebaseService, private SettingsService) {
			FirebaseService.getStories(AppSettings.topUrl, SettingsService.getMaxTop());
		}
	}

	export class NewController {
		constructor(private AppSettings, private FirebaseService, private SettingsService) {
			FirebaseService.getStories(AppSettings.newUrl, SettingsService.getMaxNew());
		}
	}

	export class AskController {
		constructor(private AppSettings, private FirebaseService, private SettingsService) {
			FirebaseService.getStories(AppSettings.askUrl, SettingsService.getMaxAsk());
		}
	}

	export class ShowController {
		constructor(private AppSettings, private FirebaseService, private SettingsService) {
			FirebaseService.getStories(AppSettings.showUrl, SettingsService.getMaxShow());
		}
	}

	export class JobsController {
		constructor(private AppSettings, private FirebaseService, private SettingsService) {
			FirebaseService.getStories(AppSettings.jobsUrl, SettingsService.getMaxJob());
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
			this.firebase = new Firebase(AppSettings.itemUrl + $stateParams.itemId);

			this.firebase.once("value",(item) => {
				this.$timeout(() => this.onGetItem(item));
			});
		}

		onGetItem(data) {
			var val = data.val();

			this.$scope.title = val.title,
			this.$scope.by = val.by,
			this.$scope.score = val.score,
			this.$scope.description = val.description,
			this.$scope.url = val.url,
			this.$scope.comments = []

			this.getKids(val.kids, this.$scope.comments);
		}

		getKids(kids, comments) {
			kids.forEach(commentId => {
				var commentRef = new Firebase(this.AppSettings.itemUrl + commentId);
				commentRef.once("value",(item) => {
					this.$timeout(() => this.onGetComment(item, comments));
				});
			})
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
		constructor(private $scope, private SettingsService) {			
			this.$scope.settings = this.SettingsService.get();
			this.$scope.$watch('settings', () => this.SettingsService.set, true);
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