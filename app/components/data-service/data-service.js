const DataBackend = require('./DataBackend.js');

angular.module('grabtangle').factory('DataService', function() {
    return new DataBackend();
});