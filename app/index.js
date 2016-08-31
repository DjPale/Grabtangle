angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap', 'datetime']);
angular.module('grabtangle').controller('AccordionDemoCtrl', function ($scope, $window) 
{
  $scope.oneAtATime = true;

  $scope.tasks = 
  [
    { completed: false, project: 'Grabtangle', action: 'Test databinding', category: '1', due: new Date('2016-08-17'), waiting: false, isOpen: false },
    { completed: false, project: 'Raspberry PI', action: 'Check network boot stuff (@NoCode)', category: '1', due: new Date('2016-08-25'), waiting: false, isOpen: false }
  ];

  const DAY_ADD = 86400000;

  var undo_obj = null;

  function setUndo(task)
  {
    if (task)
    {
      undo_obj = { completed: task.completed, project: task.project, action: task.action, category: task.category, due: new Date(task.valueOf()), waiting: task.waiting, isOpen: task.isOpen}
    }
  }

  function restore(task)
  {
    if (undo_obj)
    {
      task.action = undo_obj.action;
      //undo_obj = null;
    }
  }

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
  };

  $scope.completeTask = function($event,task)
  {
    if (task) task.completed = true;
    $event.stopPropagation();
  };

  $scope.newAction = function($event,task)
  {
    if (task)
    {
      task.isOpen = true;
      setUndo(task);
      task.action = '';
    }
    $event.stopPropagation();
  };

  $scope.waiting = function($event,task)
  {
    setUndo(task);
    task.waiting = true;
    $event.stopPropagation();
  }

  $scope.testClick = function($event,task)
  {
    $event.stopPropagation();
  };
})
/*
.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(_scope, _element) {
            $timeout(function() {
                _element[0].focus();
            });
        }
    };
});
*/
.directive('autoFocus', function($timeout) {
    return {
        link: function (scope, element, attrs) {
            attrs.$observe('autoFocus', function(newValue){
                if (newValue === 'true')
                    $timeout(function(){element[0].focus()});
            });
        }
    };
});