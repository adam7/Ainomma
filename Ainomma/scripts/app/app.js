var app = angular.module('news', ['firebase', 'ionic']);


app.config(function ($stateProvider, $urlRouterProvider) {
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
        controller: 'ItemController',
        resolve: {
            // TODO: Need to resolve the todo with a service from here ... 
        }
    })
})


app.controller('FrontPageController', ['$firebase', '$scope', '$ionicLoading', function ($firebase, $scope, $ionicLoading) {

    //$ionicLoading.show({
    //    template: 'Loading...'
    //});

    // Start with an empty array of items, this is what angular will bind to 
    $scope.items = [];

    // Get a reference to the HN api
    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/topstories");

    ref.on("child_added", onChildAdded);

    function onChildAdded(snapshot) {
        var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + snapshot.val());

        ref.once("value", onGetItem);
    }

    function onGetItem(data) {
        $scope.items.push(data.val());
        //console.log(data.val());
    }
}]);

app.controller('ItemController', ['$firebase', '$scope', '$stateParams', function ($firebase, $scope, $stateParams) {
    var itemId = $stateParams.itemId;

    globalScope = $scope;

    $scope.comments = [];
    $scope.title = "title"

    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + itemId);

    ref.once("value", onGetItem);
    
    function onGetItem(data) {
        console.log(data.val());
        globalData = data;

        $scope.title = data.val().title;
        $scope.description = data.val().by;
        $scope.comments = data.val().kids;

        console.log($scope.title);
    }
}]);
var globalScope;