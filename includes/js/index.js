'use strict';

app.controller('indexController', ['$scope', '$location', '$http', '$window', function($scope, $location, $http, $window) {

  $scope.login = function (controle) {

    $scope.mErroLogin = false;

    $http({
      url: "http://localhost/issue/includes/php/index.php",
      method: "POST",
      data:{
        op  : 1,
        controle : controle
        }
      }).then(function successCallback(response) {

        if(response.data == 0) {

          $scope.mErroLogin = true;

        } else if(response.data == 1) {
          console.log("tudo certo");

          document.location.replace('./pages');

        }

      }, function errorCallback(response) {  });

  }

}]);
