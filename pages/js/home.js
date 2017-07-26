'use strict';

app.controller('homeController', ['$scope', '$http', '$moment', '$location', '$window', function($scope, $http, $moment, $location, $window) {

  $scope.first = function (dataAtual, op) {

    $scope.mDetalhes = false;

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

    $scope.getIssuesBD();
    $scope.getInfoDia($scope.dataAtual);

  }

  $scope.getDadosUsuario = function () {

    $scope.loading = true;

    $http({
      url: "http://jira.kbase.inf.br/rest/auth/1/session",
      method: "GET",
      data:{
        }
      }).then(function successCallback(response) {

        $http({
          url: response.data.self,
          method: "GET",
          data:{
            }
          }).then(function successCallback(response) {

            $scope.dadosUsuario = response.data;
            $scope.getIssuesJira();
              
          }, function errorCallback(response) { });
          
      }, function errorCallback(response) { });

  }

  $scope.getIssuesJira = function (busca) {

    var JQL;

    if(!busca) {
      JQL = "status NOT IN ('closed', 'Resolved', 'Cancelled') AND assignee='"+$scope.dadosUsuario.name+"'";
    } else {
      JQL = "issue = '" + busca + "'";
    }

    $scope.loading = true;

    $http({
      url: "http://jira.kbase.inf.br/rest/api/2/search",
      method: "POST",
      data:{
          "jql": JQL,
          "maxResults": 100,
          "fields": [
              "summary",
              "status",
              "assignee"
          ]
      }
      }).then(function successCallback(response) {

        $scope.saveIssuesBD(response.data.issues);

      }, function errorCallback(response) { });

  }

  $scope.saveIssuesBD = function (issues) {

    $http({
      url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
      method: "POST",
      data:{
        op : 1,
        issues : issues,
        usuario : $scope.dadosUsuario.name
      }
      }).then(function successCallback(response) {

        $scope.first('', '');

      }, function errorCallback(response) { });

  }

  $scope.getIssuesBD = function () {

    $http({
      url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
      method: "POST",
      data:{
        op : 2,
        usuario : $scope.dadosUsuario.name
      }
      }).then(function successCallback(response) {

        $scope.chamados = response.data;

      }, function errorCallback(response) { });

  }

  $scope.getInfoDia = function (data) {

    $scope.publicarJira();

    $http({
      url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
      method: "POST",
      data:{
        op : 3,
        data : data,
        usuario : $scope.dadosUsuario.name
      }
      }).then(function successCallback(response) {

        $scope.infodia = response.data;
        $scope.loading = false;

      }, function errorCallback(response) { });

  }

  $scope.publicarJira = function () {

    $http({
      url: "http://jira.kbase.inf.br/rest/api/2/issue/OKI-320/worklog",
      method: "POST",
      data:{
          "comment": "[DESENV] TESTE",
          "started": "2017-07-25T08:00:00.000-0300",
          "timeSpentSeconds": 3600
      }
      }).then(function successCallback(response) {

        console.log(response.data);

      }, function errorCallback(response) { });

  }

  $scope.controleIssue = function (id) {

    $http({
      url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
      method: "POST",
      data:{
        op  : 4,
        id  : id,
        usuario : $scope.dadosUsuario.name
        }
      }).then(function successCallback(response) {

        $scope.first('', '');
        
      }, function errorCallback(response) { });

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
          id : todo.id,
          atividade : todo.atividade,
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

  $scope.salvar = function (controle) {

    $http({
      url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
      method: "POST",
      data:{
        op  : $scope.op,
        dados : controle,
        usuario : $scope.dadosUsuario.name
        }
      }).then(function successCallback(response) {

        console.log(response.data)

        $scope.first($scope.dataAtual, '');

      }, function errorCallback(response) { });

  }

  $scope.excluir = function (controle) {

    $scope.op = 100;
    $scope.salvar(controle);

  }

  $scope.logout = function () {

    $http({
      url: "http://jira.kbase.inf.br/rest/auth/1/session",
      method: "DELETE",
      headers: {
        'Content-type': 'application/json;charset=utf-8'
      }
      }).then(function successCallback(response) {
      }, function errorCallback(response) { });

    $scope.loading = true;
    $location.path('/').search({ reload: true });

  }

  $scope.detalhesIssue = function () {

    if($scope.mDetalhes == true) {
      $scope.mDetalhes = false;
    } else {
      $scope.mDetalhes = true;
    }

  }

  $scope.novaJanela = function (url) {

    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
    var win = new BrowserWindow({ width: 1200, height: 600 });
    win.maximize();
    win.loadURL(url);

  }

}]);
