'use strict';

function jiraService (http) {

    this.getIssues = function (id, cb) {

        http.get('issue/' + id, 'jira').then(
            function (res) {
                return cb(null, res);
            },
            function (err) {
                return cd(err);
            }
        );

    };

    this.search = function (data, cb) {

        let params = {
            data: data
        };
        
        http.post('search', params, 'jira').then(
            function (res) {
                return cb(null, res.data);
            },
            function (err, res) {
                return cb(err, res);
            }
        );
    };

    this.currentUser = function (params, cb) {

        http.get('session/', params, 'auth').then(
            function (res) {
                return cb(null, res.data);
            },
            function (err) {
                return cb(err);
            }
        );
    };

    this.session = function (params, cb) {

        http.post('session/', params, 'auth').then(
            function (res) {
                return cb(null, res.data);
            },
            function (err) {
                return cb(err);
            }
        );
    };


    this.getUser = function (params, cb) {

        http.param(params).then(
            function (res) {
                return cb(null, res.data);
            },
            function (err) {
                return cb(err);
            }
        );
    };

    this.publish = function (key, data, cb) {

        let params = {
            data: data
        }, 
        url = 'issue/' + key + '/worklog';

        http.post(url, params, 'jira').then(
            function (res) {
                return cb(null, res.data);
            },
            function (err) {
                return cb(err);
            }
        );
    };


};

app.service('jira', ['http', jiraService])