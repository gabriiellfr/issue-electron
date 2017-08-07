(function (){

    'use strict';

    function httpService ($http) {
        var all, odds = [];

        const rest = {
            'jira':'https://jira.kbase.inf.br/rest/api/latest/',
            'db': 'http://foxbr.ddns.net/issue-electron/pages/action/',
            'auth': 'http://jira.kbase.inf.br/rest/auth/latest/'
        };

        this.get = function (module, id, base) {

            let url = rest[base] + module;

            if (id)
                url += id;
            
            return $http.get(url);
        };

        this.post = function (module, params, base) {

            if (!params)
                params = {};

            let url = rest[base] + module;

            return $http.post(url, params);
        };

        this.param = function(params) {

            return $http(params);

        };

        this.getData = function(params) {

            return $http(params).then(function successCallback(response) {

                return response.data
                
            }, function errorCallback(response) { });

        }

    };

    app.service('http', ['$http', httpService]);

}());