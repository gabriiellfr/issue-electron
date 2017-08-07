(function (){

    'use strict';

    app.directive('modalTeste', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'app/shared/directives/modalActivity/modalActivity.html'
        };
    });

}());