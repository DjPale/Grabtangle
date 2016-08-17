angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap']);
angular.module('grabtangle').controller('AccordionDemoCtrl', function ($scope, $window) {
  $scope.oneAtATime = true;

  $scope.tasks = [
    { completed: false, project: "Grabtangle", action: "Test databinding", category: "1", due: new Date("2016-08-17"), waiting: false, isCustomHeaderOpen: false },
    { completed: false, project: "Raspberry PI", action: "Check network boot stuff (@NoCode)", category: "1", due: new Date("2016-08-25"), waiting: false, isCustomHeaderOpen: false }
  ];

  $scope.complete = function($event,task)
  {
    if (task) task.completed = true;
    $event.stopPropagation();
  }

  $scope.testClick = function($event) {
    $window.alert("baller!");
    $event.stopPropagation();
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstDisabled: false
  };
});