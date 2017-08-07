(function (){

	'use strict';

	function indexController($scope, jira, $location, $rootScope, utils) {

		const path = require('path'),
			fs = require('fs');

		let aux, fileDir = "C://WorkLog/.ac";

		function ultimoLogin () {

			let control;

			fs.readFile(fileDir, 'utf8', (err, data) => {

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
					return console.log(err);				
				};

				aux = Buffer(controle.login + ";" + controle.password).toString('base64');

				fs.exists(fileDir, (exists) => {
					if (exists)
						fs.writeFileSync(fileDir, aux);				
				});

				$location.path('/home/').search({ reload: true });
				$scope.loading = false;

			});

		};

		(function init () {

			$rootScope.versao = "1.14";
			$scope.loading = false;
			$scope.control = ultimoLogin();

			$scope.login = login;

			verificaUpdate();

		})();

	};

	indexController.$inject = ['$scope', 'jira', '$location', '$rootScope', 'utils'];

	app.controller('indexController', indexController);

}());