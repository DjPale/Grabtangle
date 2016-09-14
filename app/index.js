angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap', 'datetime']);
angular.module('grabtangle').controller('GrabtangleMainController', function ($scope, $window, $timeout) 
{
  const remote = require('electron').remote;

  var vm = $scope;
  const DAY_ADD = 86400000;

  generateDates();

  vm.oneAtATime = true;

  vm.tasks = 
  [
    { ui_state: { isOpen: false, date_open: false, cal_open: false }, completed: false, project: 'Grabtangle', action: 'Test databinding', due: new Date('2016-09-06'), waiting: false },
    { ui_state: { isOpen: false, date_open: false, cal_open: false }, completed: false, project: 'Raspberry PI', action: 'Check network boot stuff (@NoCode)', due: new Date('2016-08-25'), waiting: false }
  ];

  vm.newTask = { ui_state: { isOpen: false, date_open: false, cal_open: false }, project: '', action: '', due: new Date(), completed: false, waiting: false };

  vm.searchField = '';

  vm.filterCount = { 'Today': 0, 'Week': 0, 'Waiting': 0, 'All': 0 };

  vm.activeFilter = 'Today';
  vm.filter = [];

  vm.filter['Overdue'] = function(item)
  {
    return (item.completed == false && item.due < vm.dates[0].d);
  };

  vm.filter['Today'] = function(item)
  {
    return (item.completed == false && item.waiting == false && item.due < vm.dates[1].d);
  };

  vm.filter['Week'] = function(item)
  {
    return (item.completed == false && item.waiting == false && item.due >= vm.dates[1].d && item.due < vm.dates[3].d);
  };

  vm.filter['Waiting'] = function(item)
  {
    return (item.completed == false && item.waiting == true);
  };
  
  vm.filter['All'] = function(item)
  {
    return (item.completed == false);
  };

  vm.filterCategory = function()
  {
    return function(value) {
      // TODO: optimize!
      if (vm.searchField != '')
      {
        let sf = vm.searchField.toLowerCase();
        return (value.action.toLowerCase().indexOf(sf) != -1 || value.project.toLowerCase().indexOf(sf) != -1) && vm.filter[vm.activeFilter](value);
      }
      else
      {
        return vm.filter[vm.activeFilter](value);
      }
    };
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

    vm.dates = [];
    vm.dates.push({ n: 'Today', d: today});
    vm.dates.push({ n: 'Tomorrow', d: tomorrow});
    vm.dates.push({ n: 'Weekend', d: weekend});
    vm.dates.push({ n: 'Next week', d: nextweek});
    vm.dates.push({ n: '2 weeks', d: twoweeks});
  }

  function refreshCount()
  {
    angular.forEach(Object.keys(vm.filter), function(key)
    {
      vm.filterCount[key] = 0;
    });

    angular.forEach(vm.tasks, function(item)
    {
      angular.forEach(Object.keys(vm.filter), function(key)
      {
        if (vm.filter[key](item)) vm.filterCount[key]++;
      });
    });
  }

  function setUndo(task)
  {
    if (task)
    {
      undo_obj = { completed: task.completed, project: task.project, action: task.action, category: task.category, due: new Date(task.valueOf()), waiting: task.waiting };
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
  
  vm.setNewDate = function($event,task,d,ui_state_name)
  {
    if (task)
    {
      task.due = d.d;
      task.ui_state[ui_state_name] = false;
      $event.preventDefault();
      $event.stopPropagation();
      refreshCount();
    }
  };

  vm.completeTask = function($event,task)
  {
    if (task)
    { 
      task.completed = true;
      refreshCount();
    }
    $event.stopPropagation();
  };

  vm.newAction = function($event,task)
  {
    if (task)
    {
      task.ui_state.isOpen = true;
      setUndo(task);
      task.action = '';
      refreshCount();
    }
    $event.stopPropagation();
  };

  vm.waitTask = function($event,task)
  {
    if (task)
    {
      setUndo(task);
      task.waiting = !task.waiting;
      refreshCount();
    }
    $event.stopPropagation();
  };

  function clearNewTask()
  {
    vm.newTask.project = '';
    vm.newTask.action = '';
    vm.newTask.due = new Date();   
    vm.newTask.ui_state.isOpen = false;
  }

  vm.addTask = function()
  {    
    if (newTask.action == '') return;
    vm.tasks.push({ ui_state: { isOpen: false, date_open: false, cal_open: false }, project: vm.newTask.project, action: vm.newTask.action, due: new Date(vm.newTask.due.valueOf()), completed: false, waiting: false });
    clearNewTask();
    refreshCount();
  };

  vm.clearTask = function()
  {
    clearNewTask();
  };

  vm.winMinimize = function()
  {
    var electronWindow = remote.getCurrentWindow();
    if (!electronWindow.isMinimized()) {
        electronWindow.minimize();     
    }     
  };

  vm.winClose = function()
  {
    var electronWindow = remote.getCurrentWindow();
    electronWindow.close();
  };
})
// dunno where to put these kind of things yet /:-[
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