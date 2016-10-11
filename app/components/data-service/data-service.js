const DataBackend = require('./components/data-service/DataBackend');

const LocalStorageBackend = require('./components/data-service/LocalStorageBackend');

angular.module('grabtangle').factory('DataService', ['$timeout', function($timeout) {   
    let backend = new DataBackend(new LocalStorageBackend());

    let checker = function()
    {
        let now = new Date();
        let tomorrow = new Date();
        backend.alignDate(tomorrow);
        tomorrow.setTime(tomorrow.valueOf() + 86400001);

        $timeout(function()
        {
            backend.checkRegenerateDynamicData();
            checker();
        }, 
        tomorrow.valueOf() - now.valueOf());
    };

    checker();

    return backend;
}]);