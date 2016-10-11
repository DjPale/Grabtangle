const DataBackend = require('./components/data-service/DataBackend');

const LocalStorageBackend = require('./components/data-service/LocalStorageBackend');

angular.module('grabtangle').factory('DataService', ['$timeout', function($timeout) {   
    let backend = new DataBackend(new LocalStorageBackend());

    let checker = function()
    {
        let td = new Date();
        backend.alignDate(td);
        td.setTime(td.valueOf() + backend.DAY_ADD + 1);

        $timeout(function()
        {
            backend.checkRegenerateDynamicData();
            checker();
        }, 
        td.valueOf());
    };

    checker();

    return backend;
}]);