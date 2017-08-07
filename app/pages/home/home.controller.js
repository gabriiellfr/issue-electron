(function (){

'use strict';

app.controller('homeController', ['$scope', '$location', '$rootScope', 'http', 'utils', 'jira', 'foxbr', function($scope, $location, $rootScope, http, utils, jira, foxbr) {

  var params = {};

  $scope.init = function (dataAtual, op) {

    utils.verificaVersao($rootScope.versao);

    $scope.mDetalhes = false;

    $scope.loading = true;

    if(dataAtual == "") {

      $scope.dataAtual = moment().format("YYYY-MM-DD")

    } else {

      if(op == 1) {
        $scope.dataAtual = moment(dataAtual).subtract(1, 'days').format("YYYY-MM-DD");
      } else if(op == 2) {
       $scope.dataAtual = moment(dataAtual).add(1, 'days').format("YYYY-MM-DD");
      }

    }

    $scope.getIssuesBD();
    $scope.getInfoDay($scope.dataAtual);


  }

  $scope.getUser = function () {

    $scope.loading = true;

    jira.currentUser(null, function(err, res) {

      var params = {
        url: res.self,
        method: "GET",
        data: {}
      };
         
      jira.getUser(params, function(err, res) {

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
      url: "http://jira.kbase.inf.br/rest/api/2/search",
      method: "POST",
      data:{
          "jql": jql,
          "maxResults": 100,
          "fields": [
              "summary",
              "status",
              "assignee"
          ]
      }
    };
    
    http.param(params).then( function (issues) {

      $scope.saveIssuesBD(issues.data.issues);

    });

  }

  $scope.saveIssuesBD = function (issues) {

    params = {
      issues : issues,
      usuario : $scope.dadosUsuario.name
    }

    foxbr.insertIssue(params, function(err, res) {

      $scope.init('', '');

    });

  }

  $scope.getIssuesBD = function () {

    var params = {
      usuario : $scope.dadosUsuario.name
    };

    foxbr.getIssue(params, function(err, res) {

      $scope.chamados = res;

    });

  }

  $scope.getInfoDay = function (data) {

    var params = {
      data : data,
      usuario : $scope.dadosUsuario.name
    };

    foxbr.getInfoDay(params, function(err, res) {

        $scope.infodia = res.data;
        $scope.loading = false;

    });

  }

  $scope.getWorklogs = function () {

    var params = {
      usuario : $scope.dadosUsuario.name
    };

    foxbr.getWorklogs(params, function(err, res) {

      if(res.data.length == 0) {

        swal({
            title: "Todos Worklogs j&aacute; foram enviados",
            type: "error",
            html: true
        });

      }

      else 
        $scope.publishJira(res.data);

    });

  }


  $scope.publishJira = function (worklogs) {

    $scope.loading = true; var cont = 0;

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

      http.getData(params);

      cont++;

      if(cont == worklogs.length) {
        swal("Worklogs enviados com sucesso.", "", "success");
      }

    });

    $scope.init('', '');

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

  $scope.getWorklogsJira = function () {

    var aux = []; var i; var valid;
    angular.forEach($scope.infodia, function(todo) {
      valid = true;
      for(i = 0; i < aux.length; i++) {        
        if(aux[i] == todo.issue) {
          valid = false;
        }
      }
      if(valid == true) {
        aux.push(todo.issue);
      }
    });

    var auxSplit;

    if(aux.length > 0) {

      for(i = 0; i < aux.length; i++) {

        var params = {
          url: "http://jira.kbase.inf.br/rest/api/2/issue/"+ aux[i] +"/worklog",
          method: "GET"
        };

        http.getData(params).then(function(response) {

          angular.forEach(response.worklogs, function(todo) {

            if(todo.started.substring(0, 10) == $scope.dataAtual) {

              auxSplit = todo.self.split("/");
              $scope.deleteWorklogJira(auxSplit[7], auxSplit[9]);           

            }

          });

        });

      }

    }

  }

  $scope.deleteWorklogJira = function ($issue, $worklog) {

    var params = {
      url: "http://jira.kbase.inf.br/rest/api/2/issue/"+ $issue +"/worklog/" + $worklog,
      method: "DELETE",
      headers: {
        'Content-type': 'application/json;charset=utf-8'
      }
    };

    http.getData(params);

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

      if($scope.op == 5)
        $scope.getWorklogsJira();

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

}());