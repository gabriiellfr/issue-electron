'use strict';

app.controller('indexController', ['$scope', '$http', '$moment', '$location', '$rootScope', 'utils', function($scope, $http, $moment, $location, $rootScope, utils) {
  
  $rootScope.versao = "1.13";
  $scope.loading = false;

  $scope.ultimoLogin = function () {

    const fs = require('fs');

    fs.readFile("C://WorkLog/.ac", 'utf8', function(err, data) {

      if(data && data.length > 0) {

        var aux = new Buffer(data, 'base64').toString('ascii');
        aux = aux.split(";");

        $scope.control = {
          login : aux[0],
          password : aux[1]
        }
      }

    });

  }

  $scope.verificaUpdate = function () {

    $scope.loading = true;
    $scope.ultimoLogin();
    utils.verificaVersao($rootScope.versao).then(function(response) {

      $scope.loading = false;

    });

  }

  $scope.login = function (controle) {

    $scope.loading = true;
    $scope.mErroLogin = false;

    $http({
      url: "http://jira.kbase.inf.br/rest/auth/1/session",
      method: "POST",
      data:{
          username: controle.login,
          password: controle.password
      }
      }).then(function successCallback(response) {

        const path = require('path');
        const fs = require('fs');

        var aux = Buffer(controle.login + ";" + controle.password).toString('base64')

        fs.writeFile("C://WorkLog/.ac", aux, function(err) { }); 

        $location.path('/home/').search({ reload: true });
        $scope.loading = false;

      }, function errorCallback(response) { $scope.mErroLogin = true; $scope.loading = false; });

  }

}]);

app.directive('focus',
	function($timeout) {
		return {
			scope : {
				trigger : '@focus'
			},
			link : function(scope, element) {
				scope.$watch('trigger', function(value) {
					if (value === "true") {
						$timeout(function() {
							element[0].focus();
						});
					}
				});
			}
		};
	}
); 