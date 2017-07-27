var app = angular.module('myApp', ['ngRoute', 'angular-momentjs', 'ui.bootstrap'])

.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'indexController'
        })
        
        .when('/home', {
            templateUrl : 'pages/home.html',
            controller  : 'homeController'
        })
        
        .when('/config', {
            templateUrl : 'pages/config.html',
            controller  : 'configController'
        });

});

app.factory('http', ['$http', function($http) {
    var all, odds = [];
    var getData = function(params) {

        return $http(params).then(function successCallback(response) {

            return response.data
              
        }, function errorCallback(response) { });

    }
    return {

        getData: getData 

    };
}]);