var ainomma;
(function (ainomma) {
    var services;
    (function (services) {
        var FirebaseService = (function () {
            function FirebaseService($firebase, $timeout, AppSettings, MapperService) {
                this.$firebase = $firebase;
                this.$timeout = $timeout;
                this.AppSettings = AppSettings;
                this.MapperService = MapperService;
            }
            FirebaseService.prototype.onChildAdded = function (snapshot) {
                var _this = this;
                var ref = new Firebase(this.AppSettings.itemUrl + snapshot.val());
                ref.once("value", function (response) {
                    _this.$timeout(function () { return _this.$scope.items.push(_this.MapperService.mapItem(response.val())); });
                });
            };
            FirebaseService.prototype.getStories = function (url, title, maxResults, scope) {
                var _this = this;
                this.$scope = scope;
                this.$scope.title = title + " (" + maxResults + ")";
                // Start with an empty array of items, this is what angular will bind to 
                this.$scope.items = [];
                // Get a reference to the HN api
                var ref = new Firebase(url).limitToFirst(Number(maxResults));
                ref.on("child_added", function (child) {
                    _this.$timeout(function () { return _this.onChildAdded(child); });
                });
                this.$scope.$broadcast('scroll.refreshComplete');
            };
            return FirebaseService;
        })();
        services.FirebaseService = FirebaseService;
        var MapperService = (function () {
            function MapperService() {
            }
            MapperService.prototype.mapItem = function (item) {
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
            };
            MapperService.prototype.getIconClass = function (item) {
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
                }
                ;
            };
            return MapperService;
        })();
        services.MapperService = MapperService;
        var SettingsService = (function () {
            function SettingsService($window) {
                this.$window = $window;
                this.settingsKey = "AinommaSettings";
            }
            SettingsService.prototype.buildDefaultSettings = function () {
                return [
                    new ainomma.models.StoryTypeSetting('Max Top Stories', 100),
                    new ainomma.models.StoryTypeSetting('Max New Stories', 100),
                    new ainomma.models.StoryTypeSetting('Max Ask Stories', 100),
                    new ainomma.models.StoryTypeSetting('Max Show Stories', 100),
                    new ainomma.models.StoryTypeSetting('Max Job Stories', 100)
                ];
            };
            SettingsService.prototype.get = function () {
                var settingsString = this.$window.localStorage[this.settingsKey];
                return settingsString ? JSON.parse(settingsString) : this.buildDefaultSettings();
            };
            SettingsService.prototype.set = function (settings) {
                this.$window.localStorage[this.settingsKey] = JSON.stringify(settings);
            };
            SettingsService.prototype.getSettingValue = function (index) {
                return this.get()[index].value;
            };
            SettingsService.prototype.getMaxTop = function () {
                return this.getSettingValue(0);
            };
            SettingsService.prototype.getMaxNew = function () {
                return this.getSettingValue(1);
            };
            SettingsService.prototype.getMaxAsk = function () {
                return this.getSettingValue(2);
            };
            SettingsService.prototype.getMaxShow = function () {
                return this.getSettingValue(3);
            };
            SettingsService.prototype.getMaxJob = function () {
                return this.getSettingValue(4);
            };
            return SettingsService;
        })();
        services.SettingsService = SettingsService;
    })(services = ainomma.services || (ainomma.services = {}));
})(ainomma || (ainomma = {}));
angular.module('ainomma.services', ['firebase', 'ionic', 'ainomma.constants']).service('FirebaseService', ainomma.services.FirebaseService).service('SettingsService', ainomma.services.SettingsService).service('MapperService', ainomma.services.MapperService);
//# sourceMappingURL=services.js.map