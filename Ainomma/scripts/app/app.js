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
        controller: 'ItemController'
    })
})

// Controllers
app.controller('FrontPageController', ['$firebase', '$scope', '$ionicLoading', '$timeout', function ($firebase, $scope, $ionicLoading, $timeout) {

    //$ionicLoading.show({
    //    template: 'Loading...'
    //});

    // Start with an empty array of items, this is what angular will bind to 
    $scope.items = [];

    // Get a reference to the HN api
    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/topstories");

    ref.on("child_added", function (child) {
        $timeout(onChildAdded(child));
    });

    function onChildAdded(snapshot) {
        var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + snapshot.val());

        ref.once("value", function (item) {
            $timeout(onGetItem(item));
        });
    }

    function onGetItem(data) {
        $scope.items.push(data.val());
    }
}]);

app.controller('ItemController', ['$firebase', '$scope', '$stateParams', '$timeout', function ($firebase, $scope, $stateParams, $timeout) {

    var result;
    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + $stateParams.itemId);

    ref.once("value", function(item){
        $timeout(onGetItem(item));
    });

    function onGetItem(data) {
        var val = data.val();

        $scope.title = val.title,
        $scope.by = val.by,
        $scope.score = val.score,
        $scope.description = val.description,
        $scope.comments = []
        
        val.kids.forEach(function (commentId) {
            var commentRef = new Firebase("https://hacker-news.firebaseio.com/v0/item/" + commentId);
            commentRef.once("value", function(item){
                $timeout(onGetComment(item));
            });
        });
    }

    function onGetComment(comment) {
        console.log(comment.val().text);
        $scope.comments.push(comment.val());
    }
}]);