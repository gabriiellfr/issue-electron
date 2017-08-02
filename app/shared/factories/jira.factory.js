'use strict';

app.factory('http', ['$http', function($http) {

    var all, odds = [];
    var getData = function(params) {

        return $http(params).then(function successCallback(response) {

            return response.data
              
        }, function errorCallback(response) { });

    }
    return {

        getData: getData 

    };

}]);