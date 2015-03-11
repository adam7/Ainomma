var ainomma;
(function (ainomma) {
    var constants;
    (function (constants) {
        var AppSettings = (function () {
            function AppSettings() {
            }
            AppSettings.baseUrl = 'https://hacker-news.firebaseio.com/v0/';
            AppSettings.topUrl = AppSettings.baseUrl + 'topstories';
            AppSettings.newUrl = AppSettings.baseUrl + 'newstories';
            AppSettings.askUrl = AppSettings.baseUrl + 'askstories';
            AppSettings.showUrl = AppSettings.baseUrl + 'showstories';
            AppSettings.jobsUrl = AppSettings.baseUrl + 'jobstories';
            AppSettings.itemUrl = AppSettings.baseUrl + 'item/';
            AppSettings.userUrl = AppSettings.baseUrl + 'user/';
            return AppSettings;
        })();
        constants.AppSettings = AppSettings;
    })(constants = ainomma.constants || (ainomma.constants = {}));
})(ainomma || (ainomma = {}));
angular.module('ainomma.constants', []).constant('AppSettings', ainomma.constants.AppSettings);
//# sourceMappingURL=constants.js.map