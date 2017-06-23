'use strict';

app.controller('homeController', ['$scope', '$http', '$moment', '$location', '$window', function($scope, $http, $moment, $location, $window) {

    $scope.first = function (dataAtual, op) {

      if($location.search().reload == true) {
        $location.path('/home').search({ reload: false });
        $window.location.reload();
      }

      if(dataAtual == "") {

        dataAtual = new Date();

        $scope.diaAtual = dataAtual.getDate();
        $scope.mesAtual = dataAtual.getMonth()+1;
        $scope.anoAtual = dataAtual.getFullYear();

      } else {

        Date.prototype.addDays = function(days) {
          var dat = new Date(dataAtual);
          dat.setDate(dat.getDate() + days);
          return dat;
        }

        dataAtual = new Date(dataAtual);

        if(op == 1) {
          dataAtual = dataAtual.addDays(-1);
        } else if(op == 2) {
          dataAtual = dataAtual.addDays(1);
        }

        $scope.diaAtual = dataAtual.getDate();
        $scope.mesAtual = dataAtual.getMonth()+1;
        $scope.anoAtual = dataAtual.getFullYear();

      }

      $scope.dataAtual = $scope.anoAtual + "-" + $scope.mesAtual + "-" + $scope.diaAtual;
      $scope.auxDataAtual = $scope.diaAtual + "/" + $scope.mesAtual + "/" + $scope.anoAtual;

      $scope.getChamados();
      $scope.getInfoDia($scope.dataAtual);

    }

    $scope.getChamados = function () {

      $http({
        url: "http://foxbr.ddns.net/issue/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 1
  		    }
        }).then(function successCallback(response) {
          $scope.chamados = response.data;
        }, function errorCallback(response) { });

    }

    $scope.salvar = function (controle) {

      $http({
        url: "http://foxbr.ddns.net/issue/pages/action/home.php",
        method: "POST",
        data:{
    			op  : $scope.op,
          dados : controle
  		    }
        }).then(function successCallback(response) {
          $scope.first($scope.dataAtual, '');
        }, function errorCallback(response) { });

    }

    $scope.issue = function (id) {

      $http({
        url: "http://foxbr.ddns.net/issue/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 3,
          id  : id
  		    }
        }).then(function successCallback(response) {
          $scope.first($scope.dataAtual, '');
        }, function errorCallback(response) { });

    }

    $scope.getInfoDia = function (dataAtual) {

      $http({
        url: "http://foxbr.ddns.net/issue/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 4,
          dataAtual : dataAtual
  		    }
        }).then(function successCallback(response) {

          var aux = [];

          for(var i = 1; i <= response.data.length; i++) {
            if(i == response.data.length) {
              aux.push(response.data[i-1]);
            }

          }

          $scope.infodia = aux;

        }, function errorCallback(response) { });

    }

    $scope.parado = function () {

      $http({
        url: "http://foxbr.ddns.net/issue/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 5
  		    }
        }).then(function successCallback(response) {
          $scope.first($scope.dataAtual, '');
        }, function errorCallback(response) { });

    }

    $scope.excluir = function (controle) {

      $scope.op = 7;
      $scope.salvar(controle);

    }

    $scope.addIssue = function () {

      $scope.modalEditar = false;
      $scope.op = 2;
      delete $scope.controle;

    }

    $scope.editarIssue = function (id) {

      $scope.modalEditar = true;
      $scope.op = 8;
      delete $scope.controle;

      angular.forEach($scope.chamados, function(todo) {
        if(todo.id == id) {
          $scope.controle = {
            issue : todo.numero,
            descricao : todo.descricao,
            info : todo.info,
            id : todo.id
          };
        }
      });

    }

    $scope.editarMarcacao = function (id) {

      $scope.op = 6;

      angular.forEach($scope.infodia, function(todo) {
        if(todo.id == id) {
          $scope.controleEM = todo;
        }
      });

    }

}]);
