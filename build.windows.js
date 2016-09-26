const Q = require('q'); 
const childProcess = require('child_process'); 
const asar = require('asar'); 
const jetpack = require('fs-jetpack');
let projectDir;
let buildDir; 
let manifest; 
let appDir;

function init() 
{ 
    // Project directory is the root of the application
    projectDir = jetpack; 
    // Build directory is our destination where the final build will be placed 
    buildDir = projectDir.dir('./dist', { empty: true }); 
    // angular application directory 
    appDir = projectDir.dir('./build'); 
    // angular application's package.json file 
    manifest = appDir.read('./package.json', 'json');

    return Q(); 
} 

function copyElectron() 
{ 
     return projectDir.copyAsync('./node_modules/electron-prebuilt/dist', buildDir.path(), { overwrite: true }); 
}

function cleanupRuntime() 
{ 
     return buildDir.removeAsync('resources/default_app'); 
}

function createAsar() 
{ 
     var deferred = Q.defer();

     asar.createPackage(appDir.path(), buildDir.path('resources/app.asar'), function() 
     { 
         deferred.resolve(); 
     }); 

     return deferred.promise; 
}

function rename()
{
    return buildDir.renameAsync('electron.exe', manifest.name + '.exe');
}

function build() { 
    return init()
        .then(copyElectron) 
        .then(cleanupRuntime) 
        .then(createAsar) 
        //.then(updateResources) 
        .then(rename); 
        //.then(createInstaller); 
}

module.exports = { build: build };