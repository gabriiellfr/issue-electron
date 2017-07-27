'use strict';

app.controller('indexController', ['$scope', '$http', '$moment', '$location', function($scope, $http, $moment, $location) {
  
  $scope.versao = "1.12";
  $scope.loading = false;

  $scope.verificaUpdate = function () {

    $scope.loading = true;

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

    $http({
      url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
      method: "POST",
      data:{
          op  : 5,
          versao : $scope.versao
        }
      }).then(function successCallback(response) {

        if(response.data) {

          swal({
            title: "Existe uma nova versão disponível",
            text: "Pressione Ok e aguarde o processo terminar.",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            closeOnConfirm: false
          },
          function() {

            require('child_process').exec('cmd /c C:/worklog/update.bat', function(){});

          });

        }

        $scope.loading = false;

      }, function errorCallback(response) {  });

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


// Common directive for Focus
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