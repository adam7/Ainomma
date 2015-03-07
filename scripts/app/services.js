angular.module('ainomma.services', ['firebase', 'ionic', 'ainomma.constants'])
	.factory('FirebaseFactory', function ($firebase, $rootScope, $ionicLoading, $timeout, AppSettings) {
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
			getStories: function (url, maxResults) {
				// Start with an empty array of items, this is what angular will bind to 
				$rootScope.items = [];

				console.log(maxResults);

				// Get a reference to the HN api
				var ref = new Firebase(url).limitToFirst(Number(maxResults));

				ref.on("child_added", function (child) {
					$timeout(function () { onChildAdded(child); });
				});
			}
		}
	})

	.factory('SettingsFactory', function ($window) {
		var settingsKey = "AinommaSettings";
		var defaultSettings = [
			{ 'name': 'Max Top Stories', 'value': 100 },
			{ 'name': 'Max New Stories', 'value': 100 },
			{ 'name': 'Max Ask Stories', 'value': 100 },
			{ 'name': 'Max Show Stories', 'value': 100 },
			{ 'name': 'Max Job Stories', 'value': 100 }
		];

		return {
			get: function () {
				var settingsString = $window.localStorage[settingsKey];

				return settingsString ? JSON.parse(settingsString) : defaultSettings;
			},
			set: function (settings) {
				$window.localStorage[settingsKey] = JSON.stringify(settings);
			},

			/// TODO: Yeah I know this is nasty
			getMaxTop: function () {
				return this.get()[0].value;
			},
			getMaxNew: function () {
				return this.get()[1].value;
			},
			getMaxAsk: function () {
				return this.get()[2].value;
			},
			getMaxShow: function () {
				return this.get()[3].value;
			},
			getMaxJob: function () {
				return this.get()[4].value;
			}
		}
	});