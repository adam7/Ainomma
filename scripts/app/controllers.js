angular.module('ainomma.controllers', ['firebase', 'ionic', 'ainomma.constants', 'ainomma.services'])

	.controller('TopController', function (AppSettings, HnFirebase) {
		HnFirebase.getStories(AppSettings.topUrl);
	})

	.controller('NewController', function (AppSettings, HnFirebase) {
		HnFirebase.getStories(AppSettings.newUrl);
	})

	.controller('AskController', function (AppSettings, HnFirebase) {
		HnFirebase.getStories(AppSettings.askUrl);
	})

	.controller('ShowController', function (AppSettings, HnFirebase) {
		HnFirebase.getStories(AppSettings.showUrl);
	})

	.controller('JobsController', function (AppSettings, HnFirebase) {
		HnFirebase.getStories(AppSettings.jobsUrl);
	})

	.controller('UserController', ['$firebase', '$scope', '$stateParams', '$timeout', 'ainomma.constants.appSettings', function ($firebase, $scope, $stateParams, $timeout, AppSettings) {
		var ref = new Firebase(appSettings.userUrl + $stateParams.userId);

		ref.once("value", function (user) {
			$timeout(onGetUser(user));
		});

		function onGetUser(data) {
			var val = data.val();

			$scope.id = val.id;
			$scope.karma = val.karma;
			$scope.about = val.about;
		}
	}])

	.controller('ItemController', ['$firebase', '$scope', '$stateParams', '$timeout', 'ainomma.constants.appSettings', function ($firebase, $scope, $stateParams, $timeout, AppSettings) {

		var result;
		var ref = new Firebase(appSettings.itemUrl + $stateParams.itemId);

		ref.once("value", function (item) {
			$timeout(function () { onGetItem(item) });
		});

		function onGetItem(data) {
			var val = data.val();

			$scope.title = val.title,
			$scope.by = val.by,
			$scope.score = val.score,
			$scope.description = val.description,
			$scope.url = val.url,
			$scope.comments = []

			getKids(val.kids, $scope.comments);
		}

		function getKids(kids, comments) {
			kids.forEach(function (commentId) {
				var commentRef = new Firebase(appSettings.itemUrl + commentId);
				commentRef.once("value", function (item) {
					$timeout(function () { onGetComment(item, comments) });
				});
			});
		}

		function onGetComment(comment, comments) {
			var commentData = comment.val();
			if (!commentData.deleted) {
				comments.push(commentData);
				if (commentData.kids) {
					commentData.comments = [];
					getKids(commentData.kids, commentData.comments);
				}
			}
		}
	}]);