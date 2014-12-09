var app = angular.module('news', ['firebase', 'ionic']);

// Routing

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
            // TODO: Need to resolve the item with a service from here so that title etc. get updated!
            item: function ($stateParams, ItemsService) {
                return ItemsService.getItem($stateParams.itemId);
            }
        }
    })
})

// Services
app.factory('ItemsService', function($q){
    getItem = function (id) {
        var dfd = $q.defer();

        var item;
        var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + id);

        ref.once("value", onGetItem);

        function onGetItem(data) {
            dfd.resolve(data.val());
        }    
        return dfd.promise;
    }
    
    return {
        getItem: getItem
    }
});



// Controllers
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

app.controller('ItemController', function ($scope, item) {
    console.log(item);

    $scope.comments = item.kids;
    $scope.title = item.title;
    $scope.description = item.text;
    $scope.score = item.score;
    $scope.by = item.by;
});