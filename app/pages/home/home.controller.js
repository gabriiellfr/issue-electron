'use strict';

app.controller('homeController', ['$scope', '$moment', '$location', '$rootScope', 'http', 'utils', 'jira', 'foxbr', function($scope, $moment, $location, $rootScope, http, utils, jira, foxbr) {

  var params = {};

  $scope.init = function (dataAtual, op) {

    utils.verificaVersao($rootScope.versao);

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
    $scope.getInfoDay($scope.dataAtual);

  }

  $scope.getUser = function () {

    $scope.loading = true;

    jira.session(null, function(err, res) {

      if (err)
        console.log(err);

      var params = {
        url: res.self,
        method: "GET",
        data: {}
      };
         
      jira.getUser(params, function(err, res) {

        if (err)
          console.log(err);
        
        $scope.dadosUsuario = res;
        $scope.getIssuesJira();

      });

    });

  }

  $scope.getIssuesJira = function (search) {

    var jql = "status NOT IN ('closed', 'Resolved', 'Cancelled') AND assignee='"+$scope.dadosUsuario.name+"'";

    if(search)
      jql = "issue = '" + search + "'";

    var params = {
      "jql": jql,
      "maxResults": 100,
      "fields": [
          "summary",
          "status",
          "assignee"
      ]
    };
    
    jira.search(params, function (err, issues) {
      if (err)
        console.log(err);

      $scope.saveIssuesBD(issues);

    });

  }

  $scope.saveIssuesBD = function (issues) {

    params = {
      issues : issues,
      usuario : $scope.dadosUsuario.name
    }

    foxbr.insertIssue(params, function(err, response) {

      $scope.init('', '');

    });

  }

  $scope.getIssuesBD = function () {

    var params = {
      usuario : $scope.dadosUsuario.name
    };

    foxbr.getIssue(params, function(err, response) {

      $scope.chamados = response;

    });

  }

  $scope.getInfoDay = function (data) {

    var params = {
      data : data,
      usuario : $scope.dadosUsuario.name
    };

    foxbr.getInfoDay(params, function(err, response) {

        $scope.infodia = response;
        $scope.loading = false;

    });

  }

  $scope.getWorklogs = function () {

    var params = {
      usuario : $scope.dadosUsuario.name
    };

    foxbr.getWorklogs(params, function(err, response) {

      if(response.length == 0)
        swal("Todos Worklogs j� foram enviados.", "", "error");
      else 
        $scope.publishJira(response);

    });

  }

  $scope.publishJira = function (worklogs) {

    $scope.loading = true;

    angular.forEach(worklogs, function(value) {

      var params = {
        url: "http://jira.kbase.inf.br/rest/api/2/issue/" + value.issue + "/worklog",
        method: "POST",
        data:{
            "comment": value.info,
            "started": value.dia + "T" + value.inicio + ".000-0300",
            "timeSpentSeconds": value.segundos
        }
      };

      http.getData(params).then(function(response) {

        swal("Worklogs enviados com sucesso.", "", "success");

        $scope.loading = false;

      });

    });

  }

  $scope.issueControl = function (atividade) {

    var params = {
      url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
      method: "POST",
      data:{
        op  : 4,
        id  : $scope.idChamado,
        usuario : $scope.dadosUsuario.name,
        atividade : atividade
      }
    };

    http.getData(params).then(function(response) {

      delete $scope.iniciar;
      $scope.init('', '');

    });

  }

  $scope.editIssue = function (id) {

    $scope.modalEditar = true;
    $scope.op = 6;
    delete $scope.controle;

    angular.forEach($scope.chamados, function(todo) {
      if(todo.id == id) {

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

  $scope.editWorklog = function (id) {

    $scope.op = 5;

    angular.forEach($scope.infodia, function(todo) {
      if(todo.id == id) {
        $scope.controleEM = todo;
      }
    });

  }

  $scope.save = function (controle) {

    var params = {
      url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
      method: "POST",
      data:{
        op  : $scope.op,
        dados : controle,
        usuario : $scope.dadosUsuario.name
      }
    };

    http.getData(params).then(function(response) {

      $scope.init($scope.dataAtual, '');

    });

  }

  $scope.delete = function (controle) {

    $scope.op = 100;
    $scope.save(controle);

  }

  $scope.logout = function () {

    var params = {
      url: "http://jira.kbase.inf.br/rest/auth/1/session",
      method: "DELETE",
      headers: {
        'Content-type': 'application/json;charset=utf-8'
      }
    };

    http.getData(params);
    $scope.loading = true;
    $location.path('/').search({ reload: true });

  }

  $scope.issueDetails = function () {

    if($scope.mDetalhes == true) {
      $scope.mDetalhes = false;
    } else {
      $scope.mDetalhes = true;
    }

  }

  $scope.auxChamado = function (chamado, op) {

    $scope.idChamado = chamado;

    if(op)
      $scope.issueControl();

  }

  $scope.newWindow = function (url) {

    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
    var win = new BrowserWindow({ 
      frame: true, width: 1000, minWidth: 1000, height: 600, minHeight: 600,
      useContentSize : true, resizable: false, autoHideMenuBar: true,
      fullscreenable : false
    });
    win.maximize();
    win.loadURL(url);

  }

}]);
