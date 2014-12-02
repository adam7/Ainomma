var app = angular.module('news', ['firebase', 'ionic']);


app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/')

    $stateProvider.state('home', {
        url: '/',
        views: {
            home: {
                templateUrl: 'home.html',
                controller: 'FrontPageController'
            }
        }
    })

    $stateProvider.state('help', {
        url: '/help',
        views: {
            help: {
                templateUrl: 'help.html'
            }
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

        ref.once("value", addOnce);
    }

    function addOnce(data) {
        $scope.items.push(data.val());
        console.log(data.val());
    }
}]);

app.controller('UsersController', ['$firebase', '$scope', function ($firebase, $scope) {
    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/user/");
}]);
