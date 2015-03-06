angular.module('ainomma', ['firebase', 'ionic', 'ainomma.services', 'ainomma.controllers', 'ainomma.constants']).
	config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/')

		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'items.html',
			controller: 'TopController'
		})

		$stateProvider.state('new', {
			url: '/new',
			templateUrl: 'items.html',
			controller: 'NewController'
		})

		$stateProvider.state('ask', {
			url: '/ask',
			templateUrl: 'items.html',
			controller: 'AskController'
		})

		$stateProvider.state('show', {
			url: '/show',
			templateUrl: 'items.html',
			controller: 'ShowController'
		})

		$stateProvider.state('jobs', {
			url: '/jobs',
			templateUrl: 'items.html',
			controller: 'JobsController'
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

