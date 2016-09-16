const DataBackend = require('./components/data-service/DataBackend.js');

angular.module('grabtangle').factory('DataService', function() {
    return new DataBackend();
});