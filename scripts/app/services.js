angular.module('ainomma.services', ['firebase', 'ionic', 'ainomma.constants'])
	.factory('HnFirebase', function ($firebase, $rootScope, $ionicLoading, $timeout, AppSettings) {
		function onChildAdded(snapshot) {
			var ref = new Firebase(AppSettings.itemUrl + snapshot.val());

			ref.once("value", function (item) {
				$timeout(function () { onGetItem(item) });
			});
		}

		function onGetItem(data) {
			var val = data.val();

			$rootScope.items.push({
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

		return {
			getStories: function (url) {
				// Start with an empty array of items, this is what angular will bind to 
				$rootScope.items = [];

				// Get a reference to the HN api
				var ref = new Firebase(url);

				ref.on("child_added", function (child) {
					$timeout(function () { onChildAdded(child); });
				});
			}
		}
	})