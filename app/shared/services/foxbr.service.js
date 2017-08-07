(function (){

    'use strict';

    function foxbrService (http) {

        this.insertIssue = function (params, cb) {

            if (!params.op)
                params.op = 1;

            http.post('home.php', params, 'db').then(
                function (res) {
                    return cb(null, res);
                },
                function (err) {
                    return cb(err);
                }
            );

        };

        this.getIssue = function (params, cb) {

            if (!params.op)
                params.op = 2;

            http.post('home.php', params, 'db').then(
                function (res) {
                    return cb(null, res.data);
                },
                function (err) {
                    return cb(err);
                }
            );
        };

        this.getInfoDay = function (params, cb) {

            if (!params.op)
                params.op = 3;

            http.post('home.php', params, 'db').then(
                function (res) {
                    return cb(null, res);
                },
                function (err) {
                    return cb(err);
                }
            );
        };

        this.getWorklogs = function (params, cb) {

            if (!params.op)
                params.op = 7;

            http.post('home.php', params, 'db').then(
                function (res) {
                    return cb(null, res);
                },
                function (err) {
                    return cb(err);
                }
            );
        };


    };

    app.service('foxbr', ['http', foxbrService]);

}());