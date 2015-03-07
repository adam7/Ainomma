angular.module('ainomma.controllers', ['firebase', 'ionic', 'ainomma.constants', 'ainomma.services'])

	.controller('TopController', function (AppSettings, FirebaseFactory, SettingsFactory) {
		FirebaseFactory.getStories(AppSettings.topUrl, SettingsFactory.getMaxTop());
	})

	.controller('NewController', function (AppSettings, FirebaseFactory, SettingsFactory) {
		FirebaseFactory.getStories(AppSettings.newUrl, SettingsFactory.getMaxNew());
	})

	.controller('AskController', function (AppSettings, FirebaseFactory, SettingsFactory) {
		FirebaseFactory.getStories(AppSettings.askUrl, SettingsFactory.getMaxAsk());
	})

	.controller('ShowController', function (AppSettings, FirebaseFactory, SettingsFactory) {
		FirebaseFactory.getStories(AppSettings.showUrl, SettingsFactory.getMaxShow());
	})

	.controller('JobsController', function (AppSettings, FirebaseFactory, SettingsFactory) {
		FirebaseFactory.getStories(AppSettings.jobsUrl, SettingsFactory.getMaxJob());
	})

	.controller('UserController', function ($firebase, $scope, $stateParams, $timeout, AppSettings) {
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
	})

	.controller('ItemController', function ($firebase, $scope, $stateParams, $timeout, AppSettings) {

		var result;
		var ref = new Firebase(AppSettings.itemUrl + $stateParams.itemId);

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
				var commentRef = new Firebase(AppSettings.itemUrl + commentId);
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
	})

	.controller('SettingsController', function ($scope, SettingsFactory) {
		$scope.settings = SettingsFactory.get();

		// $scope.$watch('settings', SettingsFactory.set($scope.settings));

		$scope.$watch('settings', SettingsFactory.set, true);
	});