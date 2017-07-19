'use strict';

app.controller('homeController', ['$scope', '$http', '$moment', '$location', '$window', function($scope, $http, $moment, $location, $window) {

    $scope.verificaLogin = function () {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data:{}
        }).then(function successCallback(response) {
        }, function errorCallback(response) { 

          swal({
            title: "Sua sessão expirou!",
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            closeOnConfirm: true
          },
          function(){
            $scope.goTo("/");
          });

        });

    }

    $scope.first = function (dataAtual, op) {

      $scope.verificaLogin();
      $scope.getDadosUsuario();

      $scope.loading = true;

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
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 1
  		    }
        }).then(function successCallback(response) {

          console.log(response.data)

          $scope.chamados = response.data;
        }, function errorCallback(response) { });

    }

    $scope.detalhesIssue = function () {

      if($scope.mDetalhes == true) {
        $scope.mDetalhes = false;
      } else {
        $scope.mDetalhes = true;
      }

    }

    $scope.salvar = function (controle) {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data:{
    			op  : $scope.op,
          dados : controle
  		    }
        }).then(function successCallback(response) {

          console.log(response.data)

          $scope.first($scope.dataAtual, '');
        }, function errorCallback(response) { });

    }

    $scope.issue = function (id) {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 3,
          id  : id
  		    }
        }).then(function successCallback(response) {

          console.log(response.data)

          $scope.first($scope.dataAtual, '');
          
        }, function errorCallback(response) { });

    }

    $scope.getInfoDia = function (dataAtual) {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 4,
          dataAtual : dataAtual
  		    }
        }).then(function successCallback(response) {

          $scope.infodia = response.data;

          $scope.loading = false;

        }, function errorCallback(response) { });

    }

    $scope.parado = function () {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
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
          console.log(todo)
          $scope.controle = {
            issue : todo.numero,
            descricao : todo.descricao,
            info : todo.info,
            id : todo.id,

            horasgastas : todo.horasgastas,
            datai : todo.datai
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
	
    $scope.getDadosUsuario = function () {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data:{
    			op  : 9
  		    }
        }).then(function successCallback(response) {

          if(response.data.cod == 0) {
            $location.path("config").search({ reload: true });
          }

          $scope.dadosUsuario = response.data;
					  
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
