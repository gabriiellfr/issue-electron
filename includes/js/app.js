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