angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap', 'datetime']);
angular.module('grabtangle').controller('GrabtangleMainController', ['DataService', '$scope', '$window', '$timeout', function(DataService, $scope, $window, $timeout) 
{
  const remote = require('electron').remote;

  var vm = $scope;

  vm.oneAtATime = true;

  vm.tasks = DataService.getTasks();
  vm.dates = DataService.getDates();
  vm.newTask = DataService.getNewTask();

  DataService.setGuiStateInit('ui_state', function(task) 
  {
    if (!task) return;

    task.ui_state = { isOpen: false, date_open: false, cal_open: false };
  });

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
      DataService.setUndo(task);
      task.action = '';
      refreshCount();
    }
    $event.stopPropagation();
  };

  vm.waitTask = function($event,task)
  {
    if (task)
    {
      DataService.setUndo(task);
      task.waiting = !task.waiting;
      refreshCount();
    }
    $event.stopPropagation();
  };

  vm.addTask = function()
  {    
    DataService.commitNewTask()
    vm.newTask.ui_state.isOpen = false;
    DataService.clearNewTask();

    refreshCount();
  };

  vm.clearTask = function()
  {
    DataService.clearNewTask();
    vm.newTask.ui_state.isOpen = false;
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
}]);
