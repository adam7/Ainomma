var app = angular.module('news', ['firebase', 'ionic']);

app.constant('appSettings', {
    'apiUrl': 'https://hacker-news.firebaseio.com/v0/'
});


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
app.controller('FrontPageController', ['$firebase', '$scope', '$ionicLoading', '$timeout', 'appSettings', function ($firebase, $scope, $ionicLoading, $timeout, appSettings) {
    console.log(appSettings.apiUrl);

    // Start with an empty array of items, this is what angular will bind to 
    $scope.items = [];

    // Get a reference to the HN api
    var ref = new Firebase(appSettings.apiUrl + "/topstories");

    ref.on("child_added", function (child) {
        $timeout(onChildAdded(child));
    });

    function onChildAdded(snapshot) {
        var ref = new Firebase(appSettings.apiUrl + "/item/" + snapshot.val());

        ref.once("value", function (item) {
            $timeout(onGetItem(item));
        });
    }

    function onGetItem(data) {
        var val = data.val();
        
        $scope.items.push({
            url: val.url,
            title: val.title,
            score: val.score,
            by: val.by,
            id: val.id,
            commentCount: val.kids.length,
            iconClass: getIconClass(val.type)
        });        
    }

    function getIconClass(type) {
        switch (type) {
            case "job":
                return "ion-cash";
            case "poll":
                return "ion-stats-bars";
            default:
                return "ion-ios7-paper";
        };
    }
}]);

app.controller('ItemController', ['$firebase', '$scope', '$stateParams', '$timeout', 'appSettings', function ($firebase, $scope, $stateParams, $timeout, appSettings) {

    var result;
    var ref = new Firebase(appSettings.apiUrl + "/item/" + $stateParams.itemId);

    ref.once("value", function (item) {
        $timeout(onGetItem(item));
    });

    function onGetItem(data) {
        var val = data.val();

        $scope.title = val.title,
        $scope.by = val.by,
        $scope.score = val.score,
        $scope.description = val.description,
        $scope.url = val.url,
        $scope.comments = []

        getKids(val.kids, $scope.comments);
    }

    function getKids(kids, comments) {
        kids.forEach(function (commentId) {
            var commentRef = new Firebase(appSettings.apiUrl + "/item/" + commentId);
            commentRef.once("value", function (item) {
                $timeout(onGetComment(item, comments));
            });
        });
    }

    function onGetComment(comment, comments) {
        var commentData = comment.val();
        if (!commentData.deleted) {
            comments.push(commentData);
            if (commentData.kids) {
                commentData.comments = [];
                getKids(commentData.kids, commentData.comments);
            }
        }
    }
}]);