var ainomma;
(function (ainomma) {
    var controllers;
    (function (controllers) {
        var TopController = (function () {
            function TopController(AppSettings, FirebaseService, SettingsService) {
                this.AppSettings = AppSettings;
                this.FirebaseService = FirebaseService;
                this.SettingsService = SettingsService;
                FirebaseService.getStories(AppSettings.topUrl, SettingsService.getMaxTop());
            }
            return TopController;
        })();
        controllers.TopController = TopController;
        var NewController = (function () {
            function NewController(AppSettings, FirebaseService, SettingsService) {
                this.AppSettings = AppSettings;
                this.FirebaseService = FirebaseService;
                this.SettingsService = SettingsService;
                FirebaseService.getStories(AppSettings.newUrl, SettingsService.getMaxNew());
            }
            return NewController;
        })();
        controllers.NewController = NewController;
        var AskController = (function () {
            function AskController(AppSettings, FirebaseService, SettingsService) {
                this.AppSettings = AppSettings;
                this.FirebaseService = FirebaseService;
                this.SettingsService = SettingsService;
                FirebaseService.getStories(AppSettings.askUrl, SettingsService.getMaxAsk());
            }
            return AskController;
        })();
        controllers.AskController = AskController;
        var ShowController = (function () {
            function ShowController(AppSettings, FirebaseService, SettingsService) {
                this.AppSettings = AppSettings;
                this.FirebaseService = FirebaseService;
                this.SettingsService = SettingsService;
                FirebaseService.getStories(AppSettings.showUrl, SettingsService.getMaxShow());
            }
            return ShowController;
        })();
        controllers.ShowController = ShowController;
        var JobsController = (function () {
            function JobsController(AppSettings, FirebaseService, SettingsService) {
                this.AppSettings = AppSettings;
                this.FirebaseService = FirebaseService;
                this.SettingsService = SettingsService;
                FirebaseService.getStories(AppSettings.jobsUrl, SettingsService.getMaxJob());
            }
            return JobsController;
        })();
        controllers.JobsController = JobsController;
        var UserController = (function () {
            function UserController($firebase, $scope, $stateParams, $timeout, AppSettings) {
                var _this = this;
                this.$firebase = $firebase;
                this.$scope = $scope;
                this.$stateParams = $stateParams;
                this.$timeout = $timeout;
                this.AppSettings = AppSettings;
                this.firebase = new Firebase(AppSettings.userUrl + $stateParams.userId);
                this.firebase.once("value", function (user) {
                    _this.$timeout(function () { return _this.onGetUser(user); });
                });
            }
            UserController.prototype.onGetUser = function (data) {
                var val = data.val();
                this.$scope.id = val.id;
                this.$scope.karma = val.karma;
                this.$scope.about = val.about;
            };
            return UserController;
        })();
        controllers.UserController = UserController;
        var ItemController = (function () {
            function ItemController($firebase, $scope, $stateParams, $timeout, AppSettings) {
                var _this = this;
                this.$firebase = $firebase;
                this.$scope = $scope;
                this.$stateParams = $stateParams;
                this.$timeout = $timeout;
                this.AppSettings = AppSettings;
                this.firebase = new Firebase(AppSettings.itemUrl + $stateParams.itemId);
                this.firebase.once("value", function (item) {
                    _this.$timeout(function () { return _this.onGetItem(item); });
                });
            }
            ItemController.prototype.onGetItem = function (data) {
                var val = data.val();
                this.$scope.title = val.title, this.$scope.text = val.text, this.$scope.by = val.by, this.$scope.score = val.score, this.$scope.description = val.description, this.$scope.url = val.url, this.$scope.comments = [];
                this.getKids(val.kids, this.$scope.comments);
            };
            ItemController.prototype.getKids = function (kids, comments) {
                var _this = this;
                if (kids) {
                    kids.forEach(function (commentId) {
                        var commentRef = new Firebase(_this.AppSettings.itemUrl + commentId);
                        commentRef.once("value", function (item) {
                            _this.$timeout(function () { return _this.onGetComment(item, comments); });
                        });
                    });
                }
            };
            ItemController.prototype.onGetComment = function (comment, comments) {
                var commentData = comment.val();
                if (!commentData.deleted) {
                    comments.push(commentData);
                    if (commentData.kids) {
                        commentData.comments = [];
                        this.getKids(commentData.kids, commentData.comments);
                    }
                }
            };
            return ItemController;
        })();
        controllers.ItemController = ItemController;
        var SettingsController = (function () {
            function SettingsController($scope, SettingsService) {
                var _this = this;
                this.$scope = $scope;
                this.SettingsService = SettingsService;
                this.$scope['settings'] = this.SettingsService.get();
                this.$scope.$watch('settings', function (settings) { return _this.SettingsService.set(settings); }, true);
            }
            return SettingsController;
        })();
        controllers.SettingsController = SettingsController;
    })(controllers = ainomma.controllers || (ainomma.controllers = {}));
})(ainomma || (ainomma = {}));
angular.module('ainomma.controllers', ['firebase', 'ionic', 'ainomma.constants', 'ainomma.services']).controller('TopController', ainomma.controllers.TopController).controller('NewController', ainomma.controllers.NewController).controller('AskController', ainomma.controllers.AskController).controller('ShowController', ainomma.controllers.ShowController).controller('JobsController', ainomma.controllers.JobsController).controller('UserController', ainomma.controllers.UserController).controller('ItemController', ainomma.controllers.ItemController).controller('SettingsController', ainomma.controllers.SettingsController);
//# sourceMappingURL=controllers.js.map