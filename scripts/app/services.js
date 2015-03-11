var ainomma;
(function (ainomma) {
    var services;
    (function (services) {
        var FirebaseService = (function () {
            function FirebaseService($firebase, $rootScope, $ionicLoading, $timeout, AppSettings) {
                this.$firebase = $firebase;
                this.$rootScope = $rootScope;
                this.$ionicLoading = $ionicLoading;
                this.$timeout = $timeout;
                this.AppSettings = AppSettings;
            }
            FirebaseService.prototype.onChildAdded = function (snapshot) {
                var _this = this;
                var ref = new Firebase(this.AppSettings.itemUrl + snapshot.val());
                ref.once("value", function (item) {
                    _this.$timeout(function () { return _this.onGetItem(item); });
                });
            };
            FirebaseService.prototype.onGetItem = function (data) {
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
            };
            FirebaseService.prototype.getIconClass = function (val) {
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
                }
                ;
            };
            FirebaseService.prototype.getStories = function (url, maxResults) {
                var _this = this;
                // Start with an empty array of items, this is what angular will bind to 
                this.$rootScope.items = [];
                console.log(url);
                console.log(maxResults);
                // Get a reference to the HN api
                var ref = new Firebase(url).limitToFirst(Number(maxResults));
                ref.on("child_added", function (child) {
                    _this.$timeout(function () { return _this.onChildAdded(child); });
                });
            };
            return FirebaseService;
        })();
        services.FirebaseService = FirebaseService;
        var SettingsService = (function () {
            function SettingsService($window) {
                this.$window = $window;
                this.settingsKey = "AinommaSettings";
                this.defaultSettings = [
                    { 'name': 'Max Top Stories', 'value': 100 },
                    { 'name': 'Max New Stories', 'value': 100 },
                    { 'name': 'Max Ask Stories', 'value': 100 },
                    { 'name': 'Max Show Stories', 'value': 100 },
                    { 'name': 'Max Job Stories', 'value': 100 }
                ];
            }
            SettingsService.prototype.get = function () {
                var settingsString = this.$window.localStorage[this.settingsKey];
                return settingsString ? JSON.parse(settingsString) : this.defaultSettings;
            };
            SettingsService.prototype.set = function (settings) {
                this.$window.localStorage[this.settingsKey] = JSON.stringify(settings);
            };
            /// TODO: Yeah I know this is nasty
            SettingsService.prototype.getMaxTop = function () {
                return this.get()[0].value;
            };
            SettingsService.prototype.getMaxNew = function () {
                return this.get()[1].value;
            };
            SettingsService.prototype.getMaxAsk = function () {
                return this.get()[2].value;
            };
            SettingsService.prototype.getMaxShow = function () {
                return this.get()[3].value;
            };
            SettingsService.prototype.getMaxJob = function () {
                return this.get()[4].value;
            };
            return SettingsService;
        })();
        services.SettingsService = SettingsService;
    })(services = ainomma.services || (ainomma.services = {}));
})(ainomma || (ainomma = {}));
angular.module('ainomma.services', ['firebase', 'ionic', 'ainomma.constants']).service('FirebaseService', ainomma.services.FirebaseService).service('SettingsService', ainomma.services.SettingsService);
//# sourceMappingURL=services.js.map