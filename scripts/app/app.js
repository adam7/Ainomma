angular.module('ainomma', ['firebase', 'ionic', 'ainomma.controllers', 'ainomma.constants']).
	config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/')

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'home.html',
			controller: 'FrontPageController'
		})

		$stateProvider.state('about', {
			url: '/about',
			templateUrl: 'about.html'
		})

		$stateProvider.state('item', {
			url: '/item/:itemId',
			templateUrl: 'item.html',
			controller: 'ItemController'
		})

		$stateProvider.state('user', {
			url: '/user/:userId',
			templateUrl: 'user.html',
			controller: 'UserController'
		})
	})

