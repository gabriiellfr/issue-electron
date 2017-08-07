'use strict';

(function () {

    'use strict';

    function foxbrService(http) {

        this.insertIssue = function (params, cb) {

            if (!params.op) params.op = 1;

            http.post('home.php', params, 'db').then(function (res) {
                return cb(null, res);
            }, function (err) {
                return cb(err);
            });
        };

        this.getIssue = function (params, cb) {

            if (!params.op) params.op = 2;

            http.post('home.php', params, 'db').then(function (res) {
                return cb(null, res.data);
            }, function (err) {
                return cb(err);
            });
        };

        this.getInfoDay = function (params, cb) {

            if (!params.op) params.op = 3;

            http.post('home.php', params, 'db').then(function (res) {
                return cb(null, res);
            }, function (err) {
                return cb(err);
            });
        };

        this.getWorklogs = function (params, cb) {

            if (!params.op) params.op = 7;

            http.post('home.php', params, 'db').then(function (res) {
                return cb(null, res);
            }, function (err) {
                return cb(err);
            });
        };
    };

    app.service('foxbr', ['http', foxbrService]);
})();
'use strict';

(function () {

    'use strict';

    function httpService($http) {
        var all,
            odds = [];

        var rest = {
            'jira': 'https://jira.kbase.inf.br/rest/api/latest/',
            'db': 'http://foxbr.ddns.net/issue-electron/pages/action/',
            'auth': 'http://jira.kbase.inf.br/rest/auth/latest/'
        };

        this.get = function (module, id, base) {

            var url = rest[base] + module;

            if (id) url += id;

            return $http.get(url);
        };

        this.post = function (module, params, base) {

            if (!params) params = {};

            var url = rest[base] + module;

            return $http.post(url, params);
        };

        this.param = function (params) {

            return $http(params);
        };

        this.getData = function (params) {

            return $http(params).then(function successCallback(response) {

                return response.data;
            }, function errorCallback(response) {});
        };
    };

    app.service('http', ['$http', httpService]);
})();
'use strict';

(function () {

    'use strict';

    function jiraService(http) {

        this.getIssues = function (id, cb) {

            http.get('issue/' + id, 'jira').then(function (res) {
                return cb(null, res);
            }, function (err) {
                return cd(err);
            });
        };

        this.search = function (data, cb) {

            var params = {
                data: data
            };

            http.post('search', params, 'jira').then(function (res) {
                return cb(null, res.data);
            }, function (err, res) {
                return cb(err, res);
            });
        };

        this.currentUser = function (params, cb) {

            http.get('session/', params, 'auth').then(function (res) {
                return cb(null, res.data);
            }, function (err) {
                return cb(err);
            });
        };

        this.session = function (params, cb) {

            http.post('session/', params, 'auth').then(function (res) {
                return cb(null, res.data);
            }, function (err) {
                return cb(err);
            });
        };

        this.getUser = function (params, cb) {

            http.param(params).then(function (res) {
                return cb(null, res.data);
            }, function (err) {
                return cb(err);
            });
        };

        this.publish = function (key, data, cb) {

            var params = {
                data: data
            },
                url = 'issue/' + key + '/worklog';

            http.post(url, params, 'jira').then(function (res) {
                return cb(null, res.data);
            }, function (err) {
                return cb(err);
            });
        };
    };

    app.service('jira', ['http', jiraService]);
})();
'use strict';

(function () {

    'use strict';

    app.factory('http', ['$http', function ($http) {

        var all,
            odds = [];
        var getData = function getData(params) {

            return $http(params).then(function successCallback(response) {

                return response.data;
            }, function errorCallback(response) {});
        };
        return {

            getData: getData

        };
    }]);
})();
'use strict';

(function () {

    'use strict';

    app.factory('utils', ['$http', function ($http) {

        var verificaVersao = function verificaVersao(versao) {

            if (versao) {

                return $http({
                    url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
                    method: "POST",
                    data: {
                        op: 5,
                        versao: versao
                    }
                }).then(function successCallback(response) {

                    if (response.data) {

                        swal({
                            title: "Existe uma nova vers�o dispon�vel",
                            text: "Pressione Ok e aguarde o processo terminar.",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Ok",
                            closeOnConfirm: false
                        }, function () {

                            require('child_process').exec('cmd /c C:/worklog/update.bat', function () {});
                        });
                    }
                }, function errorCallback(response) {});
            }
        };
        return {

            verificaVersao: verificaVersao

        };
    }]);
})();
'use strict';

(function () {

  'use strict';

  app.controller('configController', ['$scope', '$http', '$moment', '$location', function ($scope, $http, $moment, $location) {

    $scope.first = function (dataAtual, op) {

      $scope.loading = true;

      $scope.getDadosUsuario();
    };

    $scope.getDadosUsuario = function () {

      $http({
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data: {
          op: 9
        }
      }).then(function successCallback(response) {

        $scope.dadosUsuario = response.data;

        $scope.loading = false;
      }, function errorCallback(response) {});
    };

    $scope.logout = function () {

      $scope.loading = true;

      $http({
        url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
        method: "POST",
        data: {
          op: 2
        }
      }).then(function successCallback(response) {

        $location.path('/').search({ reload: true });
      }, function errorCallback(response) {});
    };

    $scope.goTo = function (where) {

      $location.path(where).search({ reload: true });
    };
  }]);
})();
'use strict';

(function () {

  'use strict';

  app.controller('homeController', ['$scope', '$location', '$rootScope', 'http', 'utils', 'jira', 'foxbr', function ($scope, $location, $rootScope, http, utils, jira, foxbr) {

    var params = {};

    $scope.init = function (dataAtual, op) {

      utils.verificaVersao($rootScope.versao);

      $scope.mDetalhes = false;

      $scope.loading = true;

      if (dataAtual == "") {

        $scope.dataAtual = moment().format("YYYY-MM-DD");
      } else {

        if (op == 1) {
          $scope.dataAtual = moment(dataAtual).subtract(1, 'days').format("YYYY-MM-DD");
        } else if (op == 2) {
          $scope.dataAtual = moment(dataAtual).add(1, 'days').format("YYYY-MM-DD");
        }
      }

      $scope.getIssuesBD();
      $scope.getInfoDay($scope.dataAtual);
    };

    $scope.getUser = function () {

      $scope.loading = true;

      jira.currentUser(null, function (err, res) {

        var params = {
          url: res.self,
          method: "GET",
          data: {}
        };

        jira.getUser(params, function (err, res) {

          $scope.dadosUsuario = res;
          $scope.getIssuesJira();
        });
      });
    };

    $scope.getIssuesJira = function (search) {

      var jql = "status NOT IN ('closed', 'Resolved', 'Cancelled') AND assignee='" + $scope.dadosUsuario.name + "'";

      if (search) jql = "issue = '" + search + "'";

      var params = {
        url: "http://jira.kbase.inf.br/rest/api/2/search",
        method: "POST",
        data: {
          "jql": jql,
          "maxResults": 100,
          "fields": ["summary", "status", "assignee"]
        }
      };

      http.param(params).then(function (issues) {

        $scope.saveIssuesBD(issues.data.issues);
      });
    };

    $scope.saveIssuesBD = function (issues) {

      params = {
        issues: issues,
        usuario: $scope.dadosUsuario.name
      };

      foxbr.insertIssue(params, function (err, res) {

        $scope.init('', '');
      });
    };

    $scope.getIssuesBD = function () {

      var params = {
        usuario: $scope.dadosUsuario.name
      };

      foxbr.getIssue(params, function (err, res) {

        $scope.chamados = res;
      });
    };

    $scope.getInfoDay = function (data) {

      var params = {
        data: data,
        usuario: $scope.dadosUsuario.name
      };

      foxbr.getInfoDay(params, function (err, res) {

        $scope.infodia = res.data;
        $scope.loading = false;
      });
    };

    $scope.getWorklogs = function () {

      var params = {
        usuario: $scope.dadosUsuario.name
      };

      foxbr.getWorklogs(params, function (err, res) {

        if (res.length == 0) swal("Todos Worklogs j� foram enviados.", "", "error");else $scope.publishJira(res.data);
      });
    };

    $scope.publishJira = function (worklogs) {

      $scope.loading = true;var cont = 0;

      angular.forEach(worklogs, function (value) {

        var params = {
          url: "http://jira.kbase.inf.br/rest/api/2/issue/" + value.issue + "/worklog",
          method: "POST",
          data: {
            "comment": value.info,
            "started": value.dia + "T" + value.inicio + ".000-0300",
            "timeSpentSeconds": value.segundos
          }
        };

        http.getData(params);

        cont++;

        if (cont == worklogs.length) {
          swal("Worklogs enviados com sucesso.", "", "success");
        }
      });

      $scope.init('', '');
    };

    $scope.issueControl = function (atividade) {

      var params = {
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data: {
          op: 4,
          id: $scope.idChamado,
          usuario: $scope.dadosUsuario.name,
          atividade: atividade
        }
      };

      http.getData(params).then(function (response) {

        delete $scope.iniciar;
        $scope.init('', '');
      });
    };

    $scope.editIssue = function (id) {

      $scope.modalEditar = true;
      $scope.op = 6;
      delete $scope.controle;

      angular.forEach($scope.chamados, function (todo) {
        if (todo.id == id) {

          $scope.controle = {
            issue: todo.numero,
            descricao: todo.descricao,
            info: todo.info,
            id: todo.id,
            horasgastas: todo.horasgastas,
            datai: todo.datai
          };
        }
      });
    };

    $scope.editWorklog = function (id) {

      $scope.op = 5;

      angular.forEach($scope.infodia, function (todo) {
        if (todo.id == id) {
          $scope.controleEM = todo;
        }
      });
    };

    $scope.getWorklogsJira = function () {

      var aux = [];var i;var valid;
      angular.forEach($scope.infodia, function (todo) {
        valid = true;
        for (i = 0; i < aux.length; i++) {
          if (aux[i] == todo.issue) {
            valid = false;
          }
        }
        if (valid == true) {
          aux.push(todo.issue);
        }
      });

      var auxSplit;

      if (aux.length > 0) {

        for (i = 0; i < aux.length; i++) {

          var params = {
            url: "http://jira.kbase.inf.br/rest/api/2/issue/" + aux[i] + "/worklog",
            method: "GET"
          };

          http.getData(params).then(function (response) {

            angular.forEach(response.worklogs, function (todo) {

              if (todo.started.substring(0, 10) == $scope.dataAtual) {

                auxSplit = todo.self.split("/");
                $scope.deleteWorklogJira(auxSplit[7], auxSplit[9]);
              }
            });
          });
        }
      }
    };

    $scope.deleteWorklogJira = function ($issue, $worklog) {

      var params = {
        url: "http://jira.kbase.inf.br/rest/api/2/issue/" + $issue + "/worklog/" + $worklog,
        method: "DELETE",
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        }
      };

      http.getData(params);
    };

    $scope.save = function (controle) {

      var params = {
        url: "http://foxbr.ddns.net/issue-electron/pages/action/home.php",
        method: "POST",
        data: {
          op: $scope.op,
          dados: controle,
          usuario: $scope.dadosUsuario.name
        }
      };

      http.getData(params).then(function (response) {

        if ($scope.op == 5) $scope.getWorklogsJira();

        $scope.init($scope.dataAtual, '');
      });
    };

    $scope.delete = function (controle) {

      $scope.op = 100;
      $scope.save(controle);
    };

    $scope.logout = function () {

      var params = {
        url: "http://jira.kbase.inf.br/rest/api/2/issue/{issueIdOrKey}/worklog",
        method: "DELETE",
        headers: {
          'Content-type': 'application/json;charset=utf-8'
        }
      };

      http.getData(params);
      $scope.loading = true;
      $location.path('/').search({ reload: true });
    };

    $scope.issueDetails = function () {

      if ($scope.mDetalhes == true) {
        $scope.mDetalhes = false;
      } else {
        $scope.mDetalhes = true;
      }
    };

    $scope.auxChamado = function (chamado, op) {

      $scope.idChamado = chamado;

      if (op) $scope.issueControl();
    };

    $scope.newWindow = function (url) {

      var remote = require('electron').remote;
      var BrowserWindow = remote.BrowserWindow;
      var win = new BrowserWindow({
        frame: true, width: 1000, minWidth: 1000, height: 600, minHeight: 600,
        useContentSize: true, resizable: false, autoHideMenuBar: true,
        fullscreenable: false
      });
      win.maximize();
      win.loadURL(url);
    };
  }]);
})();
'use strict';

(function () {

			'use strict';

			function indexController($scope, jira, $location, $rootScope, utils) {

						var path = require('path'),
						    fs = require('fs');

						var aux = void 0,
						    fileDir = "C://WorkLog/.ac";

						function ultimoLogin() {

									var control = void 0;

									fs.readFile(fileDir, 'utf8', function (err, data) {

												if (data && data.length > 0) {

															aux = new Buffer(data, 'base64').toString('ascii').split(";");

															control = {
																		login: aux[0],
																		password: aux[1]
															};

															return control;
												};
									});

									return {};
						};

						function verificaUpdate() {

									$scope.loading = true;

									utils.verificaVersao($rootScope.versao).then(function (response) {

												$scope.loading = false;
									});
						};

						function login(controle) {

									$scope.loading = true;
									$scope.mErroLogin = false;

									var params = {
												username: controle.login,
												password: controle.password
									};

									jira.session(params, function (err, res) {

												if (err) {
															$scope.mErroLogin = true;
															$scope.loading = false;
															return console.log(err);
												};

												aux = Buffer(controle.login + ";" + controle.password).toString('base64');

												fs.exists(fileDir, function (exists) {
															if (exists) fs.writeFileSync(fileDir, aux);
												});

												$location.path('/home/').search({ reload: true });
												$scope.loading = false;
									});
						};

						(function init() {

									$rootScope.versao = "1.14";
									$scope.loading = false;
									$scope.control = ultimoLogin();

									$scope.login = login;

									verificaUpdate();
						})();
			};

			indexController.$inject = ['$scope', 'jira', '$location', '$rootScope', 'utils'];

			app.controller('indexController', indexController);
})();
'use strict';

(function () {

	'use strict';

	app.directive('focus', ["$timeout", function ($timeout) {
		return {
			scope: {
				trigger: '@focus'
			},
			link: function link(scope, element) {
				scope.$watch('trigger', function (value) {
					if (value === "true") {
						$timeout(function () {
							element[0].focus();
						});
					}
				});
			}
		};
	}]);
})();
'use strict';

(function () {

    'use strict';

    app.directive('modalTeste', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'app/shared/directives/modalActivity/modalActivity.html'
        };
    });
})();
'use strict';

(function () {

    'use strict';

    app.directive('modalAdd', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/directives/modalAdd/modalAdd.html'
        };
    });
})();
'use strict';

(function () {

    'use strict';

    app.directive('modalEdit', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/directives/modalEdit/modalEdit.html'
        };
    });
})();