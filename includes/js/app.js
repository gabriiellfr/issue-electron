var app = angular.module('myApp', ['ngRoute', 'angular-momentjs', 'ui.bootstrap'])

.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'app/pages/login/login.html',
            controller  : 'indexController'
        })
        
        .when('/home', {
            templateUrl : 'app/pages/home/home.html',
            controller  : 'homeController'
        })
        
        .when('/config', {
            templateUrl : 'app/pages/config/config.html',
            controller  : 'configController'
        });

});