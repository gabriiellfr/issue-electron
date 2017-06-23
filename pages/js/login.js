'use strict';

app.controller('indexController', ['$scope', '$http', '$moment', '$location', function($scope, $http, $moment, $location) {

    $scope.login = function (controle) {

      $scope.mErroLogin = false;

      $http({
        url: "http://foxbr.ddns.net/issue/includes/php/index.php",
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
            $location.path('/home/').search({ reload: true });
          }

        }, function errorCallback(response) {  });

    }

}]);
