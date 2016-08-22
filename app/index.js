angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap', "datetime"]);
angular.module('grabtangle').controller('AccordionDemoCtrl', function ($scope, $window) 
{
  $scope.oneAtATime = true;

  $scope.tasks = 
  [
    { completed: false, project: "Grabtangle", action: "Test databinding", category: "1", due: new Date("2016-08-17"), waiting: false },
    { completed: false, project: "Raspberry PI", action: "Check network boot stuff (@NoCode)", category: "1", due: new Date("2016-08-25"), waiting: false }
  ];

  const DAY_ADD = 86400000;

  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  let tomorrow = new Date(today.valueOf() + DAY_ADD);

  let dow = today.getDay();

  let weekend = new Date(today.valueOf());
  if (dow > 0 && dow < 6)
  {
    weekend.setTime(weekend.valueOf() + ((6 - dow) * DAY_ADD));
  }

  //let weekend = 
  //let nextweek =
  //let endweek =
  //let twoweeks = 
  //let endmonth =

  $scope.dates = [];
  $scope.dates.push({ n: 'Today', d: today});
  $scope.dates.push({ n: 'Tomorrow', d: tomorrow});
  $scope.dates.push({ n: 'Weekend', d: weekend});
  
  $scope.setNewDate = function($event,task,d)
  {
    task.due = d.d;
  }

  $scope.completeTask = function($event,task)
  {
    if (task) task.completed = true;
    $event.stopPropagation();
  }

  $scope.newAction = function($event,task)
  {
    $event.stopPropagation();
  }

  $scope.testClick = function($event)
  {
    $window.alert("baller!");
    $event.stopPropagation();
  };
});