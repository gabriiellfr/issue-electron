'use strict';

app.controller('configController', ['$scope', '$http', '$moment', '$location', function($scope, $http, $moment, $location) {

    $scope.first = function (dataAtual, op) {

      $scope.loading = true;

	    $scope.getDadosUsuario();

    }

    $scope.getDadosUsuario = function () {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 9
  		    }
        }).then(function successCallback(response) {

          $scope.dadosUsuario = response.data;

          $scope.loading = false;
					  
        }, function errorCallback(response) { });

    }
	
    $scope.logout = function () {

      $scope.loading = true;

      $http({
        url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
        method: "POST",
        data:{
    			op  : 2
  		    }
        }).then(function successCallback(response) {
			
			    $location.path('/').search({ reload: true });
					  
        }, function errorCallback(response) { });

    }
	
    $scope.goTo = function (where) {

      $location.path(where).search({ reload: true });

    }

}]);
