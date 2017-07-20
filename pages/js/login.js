'use strict';

app.controller('indexController', ['$scope', '$http', '$moment', '$location', function($scope, $http, $moment, $location) {

  $scope.loading = false;

  $scope.mNome    = false;
  $scope.mLogin   = false;
  $scope.mSenha   = false;
  $scope.mSenhaN  = false;
  $scope.mEmail   = false;
  $scope.mContaCriada = false;

  $scope.ultimoLogin = function () {

    const os = require('os');
    $scope.hostname = os.hostname();

    $scope.loading = true;

    $http({
      url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
      method: "POST",
      data:{
        op  : 4,
        hostname : $scope.hostname
        }
      }).then(function successCallback(response) {

        if(response.data != "false") {
          $scope.control = {
            login : response.data.usuario,
            password : response.data.senha
          }

          $scope.ultimoLogin = true;
        } else {
          $scope.ultimoLogin = false;
        }

        $scope.loading = false;

      }, function errorCallback(response) {  });

  }

  $scope.login = function (controle) {

    $scope.loading = true;

    $scope.mErroLogin = false;

    $http({
      url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
      method: "POST",
      data:{
        op  : 1,
        controle : controle,
        hostname : $scope.hostname,
        ultimoLogin : $scope.ultimoLogin
        }
      }).then(function successCallback(response) {

        console.log(response.data)

        if(response.data == 0) {

          $scope.mErroLogin = true;

        } else {
          $location.path('/home/').search({ reload: true });
        }

        $scope.loading = false;

      }, function errorCallback(response) {  });

  }

  $scope.salvar = function (controle, valida) {

    $scope.mContaCriada = false;   
    $scope.mErroCriarConta = false;     

    if(!controle) {
      controle = [];
    }

    if(!controle.nome)    { $scope.mNome     = true; } else { $scope.mNome     = false; }
    if(!controle.login)   { $scope.mLogin    = true; } else { $scope.mLogin    = false; }
    if(!controle.senha)   { $scope.mSenha    = true; } else { $scope.mSenha    = false; }
    if(!controle.senhaN)  { $scope.mSenhaN   = true; } else { $scope.mSenhaN   = false; }
    if(!controle.email)   { $scope.mEmail    = true; } else { $scope.mEmail    = false; }

    if(valida == true) {
      
      if(controle.senhaN != controle.senha) { $scope.mSenha2 = true; } else { $scope.mSenha2 = false; }

      if($scope.mSenha2 == false) {

        $http({
          url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
          method: "POST",
          data:{
            op  : 3,
            controle : controle
            }
          }).then(function successCallback(response) {

            if(response.data == 0) {
               $scope.mContaCriada = true;
               $scope.mErroCriarConta = false;
            } else {
              $scope.mContaCriada = false;
              $scope.mErroCriarConta = true;
            }

          }, function errorCallback(response) {  });

      }

    }

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