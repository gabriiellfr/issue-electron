(function (){

    'use strict';

    app.factory('utils', ['$http', function($http) {

        var verificaVersao = function(versao) {

            if(versao) {

                return $http({
                        url: "http://foxbr.ddns.net/issue-electron/includes/php/index.php",
                        method: "POST",
                        data:{
                            op  : 5,
                            versao : versao
                            }
                        }).then(function successCallback(response) {

                            if(response.data) {

                                swal({
                                    title: "Existe uma nova vers&atilde;o dispon&iacute;vel",
                                    text: "Pressione Ok e aguarde o processo terminar.",
                                    type: "warning",
                                    showCancelButton: false,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Ok",
                                    closeOnConfirm: false,
                                    html: true
                                },
                                function() {

                                    require('child_process').exec('cmd /c C:/worklog/update.bat', function(){});

                                });

                                return response.data;

                            }

                        }, function errorCallback(response) {  });

            }

        }
        return {

            verificaVersao: verificaVersao 

        };

    }]);

}());