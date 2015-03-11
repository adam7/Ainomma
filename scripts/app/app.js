var ainomma;
(function (ainomma) {
    'use strict';
    var app = angular.module('ainomma', ['firebase', 'ionic', 'ainomma.services', 'ainomma.controllers', 'ainomma.constants']).config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'templates/items.html',
            controller: 'TopController'
        });
        $stateProvider.state('new', {
            url: '/new',
            templateUrl: 'templates/items.html',
            controller: 'NewController'
        });
        $stateProvider.state('ask', {
            url: '/ask',
            templateUrl: 'templates/items.html',
            controller: 'AskController'
        });
        $stateProvider.state('show', {
            url: '/show',
            templateUrl: 'templates/items.html',
            controller: 'ShowController'
        });
        $stateProvider.state('jobs', {
            url: '/jobs',
            templateUrl: 'templates/items.html',
            controller: 'JobsController'
        });
        $stateProvider.state('item', {
            url: '/item/:itemId',
            templateUrl: 'templates/item.html',
            controller: 'ItemController'
        });
        $stateProvider.state('user', {
            url: '/user/:userId',
            templateUrl: 'templates/user.html',
            controller: 'UserController'
        });
        $stateProvider.state('about', {
            url: '/about',
            templateUrl: 'templates/about.html'
        });
        $stateProvider.state('settings', {
            url: '/settings',
            templateUrl: 'templates/settings.html',
            controller: 'SettingsController'
        });
    });
})(ainomma || (ainomma = {}));
//# sourceMappingURL=app.js.map