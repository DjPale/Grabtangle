const DataBackend = require('./components/data-service/DataBackend.js');

const LocalStorageBackend = require('./components/data-service/LocalStorageBackend.js');

angular.module('grabtangle').factory('DataService', function() {   
    return new DataBackend(new LocalStorageBackend());
});