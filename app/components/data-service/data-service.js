const DataBackend = require('./components/data-service/DataBackend');

const LocalStorageBackend = require('./components/data-service/LocalStorageBackend');

angular.module('grabtangle').factory('DataService', function() {   
    return new DataBackend(new LocalStorageBackend());
});