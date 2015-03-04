angular.module('ainomma.controllers', ['firebase', 'ionic', 'ainomma.constants'])

	.controller('FrontPageController', ['$firebase', '$scope', '$ionicLoading', '$timeout', 'ainomma.constants.appSettings', function ($firebase, $scope, $ionicLoading, $timeout, appSettings) {
		console.log(appSettings.apiUrl);

		// Start with an empty array of items, this is what angular will bind to 
		$scope.items = [];

		// Get a reference to the HN api
		var ref = new Firebase(appSettings.apiUrl + "/topstories");

		ref.on("child_added", function (child) {
			$timeout(function () { onChildAdded(child); });
		});

		function onChildAdded(snapshot) {
			var ref = new Firebase(appSettings.apiUrl + "/item/" + snapshot.val());

			ref.once("value", function (item) {
				$timeout(function () { onGetItem(item) });
			});
		}

		function onGetItem(data) {
			var val = data.val();

			$scope.items.push({
				url: val.url,
				title: val.title,
				score: val.score,
				by: val.by,
				id: val.id,
				commentCount: val.kids ? val.kids.length : 0,
				iconClass: getIconClass(val)
			});
		}

		function getIconClass(val) {
			switch (val.type) {
				case "job":
					return "ion-cash";
				case "poll":
					return "ion-stats-bars";
				default:
					// Ask posts start with "Ask HN:"
					if (val.title.substring(0, 7) === "Ask HN:")
						return "ion-help-circled";
					// Show posts start with "Show HN:"
					if (val.title.substring(0, 8) === "Show HN:")
						return "ion-eye";
					return "ion-ios7-paper";
			};
		}
	}])

	.controller('UserController', ['$firebase', '$scope', '$stateParams', '$timeout', 'ainomma.constants.appSettings', function ($firebase, $scope, $stateParams, $timeout, appSettings) {
		var ref = new Firebase(appSettings.apiUrl + "/user/" + $stateParams.userId);

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

	.controller('ItemController', ['$firebase', '$scope', '$stateParams', '$timeout', 'ainomma.constants.appSettings', function ($firebase, $scope, $stateParams, $timeout, appSettings) {

		var result;
		var ref = new Firebase(appSettings.apiUrl + "/item/" + $stateParams.itemId);

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
				var commentRef = new Firebase(appSettings.apiUrl + "/item/" + commentId);
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