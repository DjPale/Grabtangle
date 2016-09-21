const storage = require('electron-json-storage');

class LocalStorageBackend
{
    writeData(name, data, callback = null)
    {
        if (callback == null) callback = function() {};

        storage.set(name, data, callback);
    }

    readData(name, callback)
    {
        storage.get(name, callback);
    }

}

module.exports = LocalStorageBackend;