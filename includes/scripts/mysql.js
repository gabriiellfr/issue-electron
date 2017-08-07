'use strict';
var mysql  = require('mysql');
var util = require('util');

/**
 * @ngdoc service
 * @name electroCrudApp.mysql
 * @description
 * # mysql
 * Service in the electroCrudApp.
 */
angular.module('myApp.services', [])
  .service('mysql', function ($rootScope, $q) {

    /** database configuration */
    var dbConfig = {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'basecontrole'
    };

    /** require node mysql dan init pool */
    var mysql = require('mysql');
    var db = mysql.createPool(dbConfig)
    // query dengan promise
    $rootScope.dbQuery = function(query, param) {
      var defer = $q.defer();
      db.getConnection(function(err, conn) {
        if (err) defer.reject(err);
        if (angular.isUndefined(param)) param = [];
        conn.query(query, param, function(err, rows) {
          conn.release();
          if (err) defer.reject(err);
          defer.resolve(rows);
        });
      })
      return defer.promise;
    };

    return {
      getConnection: function() {

        $rootScope.dbQuery("SELECT * FROM beneficios_controle");

      },
      getTunnelConnection: function(ssh_host, ssh_port, ssh_username, ssh_password,
        mysql_host, mysql_port, mysql_user, mysql_password, mysql_database) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          var tunnelPort = Math.round(Math.random()*10000);
          var config = {
            host: ssh_host,
            srcPort: tunnelPort,
            dstPort: ssh_port,
            username: ssh_username,
            password: ssh_password
          };
          var server = tunnel(config)
            .then(function (result) {
              resolve(_this.getDirectConnection(mysql_host, tunnelPort, mysql_user, mysql_password, mysql_database));
            })
            .catch(function (err) {
              reject(err);
            })
        });
      },
      getDirectConnection: function(host, port, user, password, database) {
        var connectionProps = {
          host: host,
          port: port,
          user: user,
          password: password
        };
        if (database) {
          connectionProps.database = database;
        }
        return mysql.createConnection(connectionProps);
      },
      getDatabases: function(connection) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('SHOW DATABASES', function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      getTables: function(connection) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('SHOW TABLES', function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      getTableDesc: function(connection, table) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('DESC ??', [table], function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      getTableCount: function(connection, table, whereStr) {
        var whereSql = whereStr ? util.format('WHERE %s', whereStr) : '';
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query(util.format('SELECT COUNT(*) as count FROM %s %s', table, whereSql), function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows[0].count);
          });
        });
      },
      getTableData: function(connection, table, columns, limitFrom, limitCount, sortBy, sortDir, whereStr) {
        sortBy = !sortBy ? 1 : sortBy;
        sortDir = !sortDir ? "ASC" : sortDir;
        whereStr = whereStr ? util.format('WHERE %s', whereStr) : '';
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('SELECT ?? FROM ?? '+whereStr+' ORDER BY ?? '+sortDir+' LIMIT '+limitFrom+', '+limitCount, [columns, table, sortBy], function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      getQuery: function(connection, sql) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query(sql, function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      getTableRowData: function(connection, table, columns, where) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('SELECT ?? FROM ?? WHERE ?', [columns,table, where],function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      insertData: function(connection, table, data) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('INSERT INTO ?? SET ?', [table, data], function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      updateData: function(connection, table, data) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('UPDATE IGNORE ?? SET ?',[table, data], function(err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
      deleteData: function(connection, table, data) {
        return new Promise(function(resolve, reject) {
          if (!connection) reject();
          connection.query('DELETE FROM ?? WHERE ?', [table, data], function(err, rows, fields) {
            if (err) reject(err);
            resolve();
          });
        });
      },
      closeConnection: function(connection) {
        connection.end();
      }
    };
  });
