(function (){

	'use strict';

	function indexController($scope, jira, $location, $rootScope, utils) {

		const path = require('path'),
			fs = require('fs');

		let aux, fileDir = "C://WorkLog/.ac";

		function ultimoLogin () {

			fs.readFile(fileDir, 'utf8', (err, data) => {

				if (data && data.length > 0) {

					aux = new Buffer(data, 'base64').toString('ascii').split(";");

					$scope.control = {
						login: aux[0],
						password: aux[1]
					};

				};

			});

		};

		function verificaUpdate () {

			$scope.loading = true;

			utils.verificaVersao($rootScope.versao).then(function (response) {

				$scope.loading = false;

			});

		};

		function login (controle) {

			$scope.loading = true;
			$scope.mErroLogin = false;

			let params = {
				username: controle.login,
				password: controle.password
			};

			jira.session(params, (err, res) => {

				if (err) {

					$scope.mErroLogin = true; 
					$scope.loading = false;	

				} else {

					aux = Buffer(controle.login + ";" + controle.password).toString('base64');

					fs.exists(fileDir, (exists) => {
						if (exists)
							fs.writeFileSync(fileDir, aux);				
					});

					$location.path('/home/').search({ reload: true });
					$scope.loading = false;

				}

			});

		};

		function navbar () {

			const remote = require('electron').remote;

			document.getElementById("min-btn").addEventListener("click", function (e) {
				var window = remote.getCurrentWindow();
				window.minimize(); 
			});

			document.getElementById("close-btn").addEventListener("click", function (e) {
				var window = remote.getCurrentWindow();
				window.close();
			}); 

		};

		(function init () {

			$rootScope.versao = "1.14";
			$scope.loading = false;

			$scope.login = login;
			
			ultimoLogin();
			verificaUpdate();
			navbar();

		})();

	};

	indexController.$inject = ['$scope', 'jira', '$location', '$rootScope', 'utils'];

	app.controller('indexController', indexController);

}());