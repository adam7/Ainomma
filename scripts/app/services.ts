module ainomma.services {
	export class FirebaseService {
		constructor(private $firebase, private $rootScope, private $timeout, private AppSettings, private MapperService: MapperService) {
		}

		private onChildAdded(snapshot) {
			var ref = new Firebase(this.AppSettings.itemUrl + snapshot.val());

			ref.once("value",(response) => {
				this.$timeout(() => this.$rootScope.items.push(this.MapperService.mapItem(response.val())));
			});
		}

		getStories(url, maxResults) {
			// Start with an empty array of items, this is what angular will bind to 
			this.$rootScope.items = [];
			
			console.log(maxResults);

			// Get a reference to the HN api
			var ref = new Firebase(url).limitToFirst(Number(maxResults));

			ref.on("child_added",(child) => {
				this.$timeout(() => this.onChildAdded(child));
			});
		}
	}


	export class MapperService {
		mapItem(item): ainomma.models.Item {
			var result = new ainomma.models.Item();

			result.url = item.url;
			result.storyUrl = "#/item/" + item.id;
			result.title = item.title;
			result.text = item.text;
			result.score = item.score;
			result.by = item.by;
			result.id = item.id;
			result.commentCount = item.kids ? item.kids.length : 0;
			result.iconClass = this.getIconClass(item);

			return result;
		}

		private getIconClass(item): string {
			switch (item.type) {
				case "job":
					return "ion-cash";
				case "poll":
					return "ion-stats-bars";
				default:
					// Ask posts start with "Ask HN:"
					if (item.title.substring(0, 7) === "Ask HN:")
						return "ion-help-circled";					
					// Show posts start with "Show HN:"
					if (item.title.substring(0, 8) === "Show HN:")
						return "ion-eye";

					return "ion-ios7-paper";
			};
		}
	}


	export class SettingsService {
		settingsKey: string = "AinommaSettings";

		constructor(private $window: ng.IWindowService) {
		}

		buildDefaultSettings(): Array<models.StoryTypeSetting> {
			return [
				new models.StoryTypeSetting('Max Top Stories', 100),
				new models.StoryTypeSetting('Max New Stories', 100),
				new models.StoryTypeSetting('Max Ask Stories', 100),
				new models.StoryTypeSetting('Max Show Stories', 100),
				new models.StoryTypeSetting('Max Job Stories', 100)
			]
		}

		get(): Array<models.StoryTypeSetting>{
			var settingsString = this.$window.localStorage[this.settingsKey];

			return settingsString ? JSON.parse(settingsString) : this.buildDefaultSettings();
		}

		set(settings: Array<models.StoryTypeSetting>) {
			console.log(settings);
			this.$window.localStorage[this.settingsKey] = JSON.stringify(settings);
		}

		private getSettingValue(index: number) {
			return this.get()[index].value;
		}
		
		getMaxTop() { return this.getSettingValue(0) }
		getMaxNew() { return this.getSettingValue(1) }
		getMaxAsk() { return this.getSettingValue(2) }
		getMaxShow() { return this.getSettingValue(3) }
		getMaxJob() { return this.getSettingValue(4); }
	}
}

angular.module('ainomma.services', ['firebase', 'ionic', 'ainomma.constants'])
	.service('FirebaseService', ainomma.services.FirebaseService)
	.service('SettingsService', ainomma.services.SettingsService)
	.service('MapperService', ainomma.services.MapperService);
