module ainomma.services {
	export class FirebaseService {
		constructor(private $firebase, private $rootScope, private $ionicLoading, private $timeout, private AppSettings) {
		}

		onChildAdded(snapshot) {
			var ref = new Firebase(this.AppSettings.itemUrl + snapshot.val());

			ref.once("value", (item) => {
				this.$timeout(() => this.onGetItem(item));
			});
		}

		onGetItem(data) {
			var val = data.val();

			this.$rootScope.items.push({
				url: val.url,
				title: val.title,
				score: val.score,
				by: val.by,
				id: val.id,
				commentCount: val.kids ? val.kids.length : 0,
				iconClass: this.getIconClass(val)
			});
		}

		getIconClass(val) {
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

		public getStories(url, maxResults) {
			// Start with an empty array of items, this is what angular will bind to 
			this.$rootScope.items = [];

			console.log(url);
			console.log(maxResults);

			// Get a reference to the HN api
			var ref = new Firebase(url).limitToFirst(Number(maxResults));

			ref.on("child_added", (child) => {
				this.$timeout(() => this.onChildAdded(child));
			});
		}
	}

	export class SettingsService {
		settingsKey: string = "AinommaSettings";
		defaultSettings: Array<any> = [
			{ 'name': 'Max Top Stories', 'value': 100 },
			{ 'name': 'Max New Stories', 'value': 100 },
			{ 'name': 'Max Ask Stories', 'value': 100 },
			{ 'name': 'Max Show Stories', 'value': 100 },
			{ 'name': 'Max Job Stories', 'value': 100 }
		];
		
		constructor(private $window: ng.IWindowService) {
		}

		get() {
			var settingsString = this.$window.localStorage[this.settingsKey];

			return settingsString ? JSON.parse(settingsString) : this.defaultSettings;
		}

		set(settings) {
			this.$window.localStorage[this.settingsKey] = JSON.stringify(settings);
		}

		/// TODO: Yeah I know this is nasty
		getMaxTop() { return this.get()[0].value; }
		getMaxNew() { return this.get()[1].value; }
		getMaxAsk() { return this.get()[2].value; }
		getMaxShow() { return this.get()[3].value; }
		getMaxJob() { return this.get()[4].value; }
	}
}

angular.module('ainomma.services', ['firebase', 'ionic', 'ainomma.constants'])
	.service('FirebaseService', ainomma.services.FirebaseService)
	.service('SettingsService', ainomma.services.SettingsService);
