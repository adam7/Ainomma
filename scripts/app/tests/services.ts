module ainomma.tests {
	describe("MapperService",() => {
		describe("when mapping a story",() => {
			var item = {
				url: "http://google.com",
				title: "This is a story title",
				text: "This is some story text",
				score: 57,
				by: "userId",
				id: "storyId",
				kids: ["1", "2", "3"],
				type: "story"
			};

			var mapperService = new ainomma.services.MapperService();

			var result = mapperService.mapItem(item);

			it("url should be set",() => {
				expect(item.url).toEqual(result.url);
			});

			it("storyUrl should be a link to the item page",() => {
				expect("#/item/" + item.id).toEqual(result.storyUrl);
			});

			it("title should be set",() => {
				expect(item.title).toEqual(result.title);
			});

			it("text should be set",() => {
				expect(item.text).toEqual(result.text);
			});

			it("score should be set",() => {
				expect(item.score).toEqual(result.score);
			});

			it("comments should be counted",() => {
				expect(3).toEqual(result.commentCount);
			});

			it("should have the correct icon class",() => {
				expect(result.iconClass).toEqual("ion-ios7-paper");
			});

		});

		describe("when mapping a story with no kids",() => {
			var item = {
				title: "whatever"
			};

			var mapperService = new ainomma.services.MapperService();

			var result = mapperService.mapItem(item);

			it("should have a comment count of zero",() => {
				expect(result.commentCount).toBe(0);
			});
		});

		describe("when mapping a 'Show HN' story",() => {
			var item = {
				type: "story",
				title: "Show HN: Look at this thing"
			};

			var mapperService = new ainomma.services.MapperService();

			var result = mapperService.mapItem(item);

			it("should have the correct icon class",() => {
				expect(result.iconClass).toEqual("ion-eye");
			});
		});

		describe("when mapping a 'Ask HN' story",() => {
			var item = {
				type: "story",
				title: "Ask HN: This is a question?"
			};

			var mapperService = new ainomma.services.MapperService();

			var result = mapperService.mapItem(item);

			it("should have the correct icon class",() => {
				expect(result.iconClass).toEqual("ion-help-circled");
			});
		});

		describe("when mapping a job",() => {
			var item = {
				type: "job"
			};

			var mapperService = new ainomma.services.MapperService();

			var result = mapperService.mapItem(item);

			it("should have the correct icon class",() => {
				expect(result.iconClass).toEqual("ion-cash");
			});
		});

		describe("when mapping a poll",() => {
			var item = {
				type: "poll"
			};

			var mapperService = new ainomma.services.MapperService();

			var result = mapperService.mapItem(item);

			it("should have the correct icon class",() => {
				expect(result.iconClass).toEqual("ion-stats-bars");
			});
		});
	});

	describe("SettingsService",() => {
		describe("when getting settings and there are no settings",() => {
			it("should get default settings",() => {
				var $window = <ng.IWindowService>{};
				$window.localStorage = <Storage>{};
				
				var settingsService = new services.SettingsService($window);
				var defaultSettings = settingsService.buildDefaultSettings();

				var result = settingsService.get();

				// Using angular.equals for comparison because toEqual will fail due to added angular properties
				expect(angular.equals(defaultSettings, result)).toBe(true);				
			});
		});

		describe("when saving settings",() => {
			it("should return saved settings",() => {
				var $window = <ng.IWindowService>{};
				$window.localStorage = <Storage>{};

				var settingsService = new services.SettingsService($window);

				var newSettings = new Array<models.StoryTypeSetting>(
					new models.StoryTypeSetting(""),
					new models.StoryTypeSetting("")
					);

				settingsService.set(newSettings);

				// Using angular.equals for comparison because toEqual will fail due to added angular properties
				expect(angular.equals(newSettings, settingsService.get())).toBe(true);				
			});
		});
	});
}