angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap', 'datetime']);
angular.module('grabtangle').controller('GrabtangleMainController', ['DataService', '$scope', '$window', '$timeout', function(DataService, $scope, $window, $timeout) 
{
  const electron = require('electron');
  const ipc = electron.ipcRenderer;
  const remote = electron.remote;

  const UNDO_TIME = 5000;
  const KEYCODE_ESC = 27;
  const KEYCODE_ENTER = 13;
  const TOOLTIP_DELAY = 2000;

  var vm = $scope;

  vm.oneAtATime = true;
  vm.tasks = DataService.getTasks();
  vm.dates = DataService.getDates();
  vm.newTask = DataService.getNewTask();
  vm.undo = DataService.getUndo();

  vm.tt_delay = TOOLTIP_DELAY;

  DataService.setGuiStateInit('ui_state', function(task) 
  {
    if (!task) return;

    task.ui_state = { isOpen: false, date_open: false, cal_open: false };
  });

  vm.searchField = '';

  vm.filterCount = { 'Today': 0, 'Week': 0, 'Waiting': 0, 'All': 0 };

  vm.activeFilter = 'Today';
  vm.filter = [];

  // filter without categories (so we don't need to summarize them)
  vm.ufilter = [];

  vm.ufilter['Overdue'] = function(item)
  {
    return (item.completed == false && item.due < vm.dates[0].d);
  };

  vm.ufilter['Long'] = function(item)
  {
    return (item.completed == false && item.due >= vm.dates[3].d);
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

  DataService.loadData(function(tasks) 
  {
    refreshCount(); 
    $scope.$apply();
  });

  vm.setNewDate = function($event,task,d,ui_state_name)
  {
    if (task)
    {
      task.ui_state[ui_state_name] = false;
      $event.preventDefault();
      $event.stopPropagation();

      // ignore same date
      if (d.d.getTime() == task.due.getTime()) return;

      if (task != vm.newTask)
      {
        DataService.setUndo(task, 'Change task time');
        vm.startUndoTimer();
      }

      task.due = d.d;
      refreshCount();
    }
  };

  vm.completeTask = function($event,task)
  {
    if (task)
    { 
      DataService.setUndo(task, 'Completed task');
      vm.startUndoTimer();

      task.completed = true;
      refreshCount();
    }
    $event.stopPropagation();
  };

  vm.newAction = function($event,task)
  {
    if (task)
    {
      DataService.setUndo(task);

      task.ui_state.isOpen = true;
      task.action = '';
      refreshCount();
    }
    $event.stopPropagation();
  };

  vm.waitTask = function($event,task)
  {
    if (task)
    {
      DataService.setUndo(task, 'Moved task ' + (task.waiting ? 'from' : 'to') + ' waiting');
      vm.startUndoTimer();

      task.waiting = !task.waiting;
      refreshCount();
    }
    $event.stopPropagation();
  };

  vm.addNewTask = function()
  {    
    DataService.commitNewTask('Added new task');
    vm.startUndoTimer();

    vm.newTask.ui_state.isOpen = false;
    DataService.clearNewTask();

    refreshCount();
  };

  vm.clearNewTask = function()
  {
    DataService.clearNewTask();
    vm.newTask.ui_state.isOpen = false;
  };

  vm.undoPromise = null;

  vm.startUndoTimer = function()
  {
    if (vm.undoPromise) $timeout.cancel(vm.undoPromise);

    vm.undoPromise = $timeout(function() 
    { 
      vm.closeUndo();
    }, 
    UNDO_TIME);
  };

  vm.closeUndo = function()
  {
    DataService.clearUndo();
  };

  vm.restoreUndo = function()
  {
    DataService.restoreUndo();

    refreshCount();
  };

  vm.checkKey = function($event, task)
  {
    if ($event.keyCode === KEYCODE_ESC)
    { 
      DataService.restoreUndo(false);

      if (task) task.ui_state.isOpen = false;
    }
    else if ($event.keyCode === KEYCODE_ENTER)
    {
      if (task) task.ui_state.isOpen = false;
    }
  };

  vm.checkNewTaskKey = function($event)
  {
    if ($event.keyCode === KEYCODE_ESC)
    {
      vm.clearNewTask();
    }
    else if ($event.keyCode === KEYCODE_ENTER)
    {
      vm.addNewTask();
    }
  };

  vm.winMinimize = function()
  {
    var electronWindow = remote.getCurrentWindow();
    if (!electronWindow.isMinimized()) {
        electronWindow.minimize();     
        DataService.adviseWrite();     
    }
  };

  vm.winClose = function()
  {
    DataService.adviseWrite(function()
    {
      var electronWindow = remote.getCurrentWindow();
      electronWindow.close();
    });     
  };

  ipc.on('add-task', function() 
  {
    // must have timeout here for some reason
    $timeout(function() 
    { 
      vm.newTask.ui_state.isOpen = true; 
    });
  });
}]);
