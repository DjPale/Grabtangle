// get the dependencies
const gulp          = require('gulp');
const childProcess  = require('child_process'); 
const electron      = require('electron-prebuilt');
const jetpack       = require('fs-jetpack');
const usemin        = require('gulp-usemin');
const uglify        = require('gulp-uglify');

const release_windows = require('./build.windows'); 
const os              = require('os'); 

//const winInstaller = require('electron-winstaller');

const projectDir  = jetpack;
let srcDir        = projectDir.cwd('./app');
let dstDir        = projectDir.cwd('./build');

// run with electron - attach
gulp.task('run', function()
{ 
  childProcess.spawn(electron, ['--debug=5858','./app'], { stdio: 'inherit' }); 
});

gulp.task('clean', function(callback)
{
  return dstDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function()
{
  return projectDir.copyAsync('app', dstDir.path(), 
  {
    overwrite: true,
    matching: [
      './node_modules/**/*',
      '*.html',
      'assets/*',
      'components/**/*',
      'main.js',
      'package.json'      
    ]
  });
});

gulp.task('build', ['copy'], function()
{
  return gulp.src('./app/index.html')
    .pipe(usemin({
      js: [uglify()]
    }))
    .pipe(gulp.dest('./build/'));
});

 gulp.task('build-electron', ['build'], function()
 { 
     switch (os.platform()) { 
         case 'darwin': 
         // execute build.osx.js 
         break; 
         case 'linux': 
         //execute build.linux.js 
         break; 
         case 'win32': 
         return release_windows.build(); 
     } 
}); 

/*
gulp.task('windows-installer', function(done) {
  winInstaller.createWindowsInstaller({
    appDirectory: './dist',
    outputDirectory: './installer',
  }).then(done).catch(done);
});
*/
