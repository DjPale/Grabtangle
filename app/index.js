angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap', 'datetime']);
angular.module('grabtangle').controller('AccordionDemoCtrl', function ($scope, $window) 
{
  const DAY_ADD = 86400000;

  generateDates();

  $scope.oneAtATime = true;

  $scope.tasks = 
  [
    { completed: false, project: 'Grabtangle', action: 'Test databinding', category: '1', due: new Date('2016-09-06'), waiting: false, isOpen: false },
    { completed: false, project: 'Raspberry PI', action: 'Check network boot stuff (@NoCode)', category: '1', due: new Date('2016-08-25'), waiting: false, isOpen: false }
  ];

  $scope.test = [];

  $scope.filterCount = { 'Today': 0, 'Week': 0, 'Waiting': 0, 'All': 0 };

  $scope.activeFilter = 'Today';
  $scope.filter = [];
  $scope.filter['Today'] = function(item)
  {
    return (item.completed == false && item.waiting == false && item.due < $scope.dates[1].d);
  };

  $scope.filter['Week'] = function(item)
  {
    return (item.completed == false && item.waiting == false && item.due < $scope.dates[3].d);
  };

  $scope.filter['Waiting'] = function(item)
  {
    return (item.completed == false && item.waiting == true);
  };
  
  $scope.filter['All'] = function(item)
  {
    return (item.completed == false);
  };

  $scope.filterCategory = function()
  {
    return $scope.filter[$scope.activeFilter];
  };

  refreshCount();

  var undo_obj = null;

  function generateDates()
  {
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

    let nextweek = new Date(today.valueOf());
    let daystonext = (7 - dow + 1) % 7; // how long to next day of week (Monday)
    if (daystonext == 0) daystonext = 7; // this means next Monday if we are already on Monday
    nextweek.setTime(nextweek.valueOf() + daystonext * DAY_ADD);
    
    let twoweeks = new Date(today.valueOf());
    twoweeks.setTime(twoweeks.valueOf() + 14 * DAY_ADD); 

    $scope.dates = [];
    $scope.dates.push({ n: 'Today', d: today});
    $scope.dates.push({ n: 'Tomorrow', d: tomorrow});
    $scope.dates.push({ n: 'Weekend', d: weekend});
    $scope.dates.push({ n: 'Next week', d: nextweek});
    $scope.dates.push({ n: '2 weeks', d: twoweeks});
  }


  function refreshCount()
  {
    angular.forEach(Object.keys($scope.filter), function(key)
    {
      $scope.filterCount[key] = 0;
    });

    angular.forEach($scope.tasks, function(item)
    {
      angular.forEach(Object.keys($scope.filter), function(key)
      {
        if ($scope.filter[key](item)) $scope.filterCount[key]++;
      });
    });
  }

  function setUndo(task)
  {
    if (task)
    {
      undo_obj = { completed: task.completed, project: task.project, action: task.action, category: task.category, due: new Date(task.valueOf()), waiting: task.waiting, isOpen: task.isOpen};
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
  
  $scope.setNewDate = function($event,task,d)
  {
    if (task)
    {
      task.due = d.d;
      refreshCount();
    }
  };

  $scope.completeTask = function($event,task)
  {
    if (task)
    { 
      task.completed = true;
      refreshCount();
    }
    $event.stopPropagation();
  };

  $scope.newAction = function($event,task)
  {
    if (task)
    {
      task.isOpen = true;
      setUndo(task);
      task.action = '';
      refreshCount();
    }
    $event.stopPropagation();
  };

  $scope.waitTask = function($event,task)
  {
    if (task)
    {
      setUndo(task);
      task.waiting = !task.waiting;
      refreshCount();
    }
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
                    $timeout(function(){element[0].focus();});
            });
        }
    };
});