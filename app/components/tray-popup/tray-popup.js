angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap', 'datetime']);
angular.module('grabtangle').controller('TrayPopupController', function ($scope, $window, $timeout) 
{
  var vm = $scope;

  vm.newTask = { ui_state: { isOpen: false, date_open: false, cal_open: false }, project: '', action: '', due: new Date(), completed: false, waiting: false };

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
});
