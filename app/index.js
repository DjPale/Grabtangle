angular.module('grabtangle', ['ngAnimate', 'ui.bootstrap']);
angular.module('grabtangle').controller('AccordionDemoCtrl', function ($scope, $window) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.tasks = [
    { project: "", action: "" }
  ];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.testClick = function($event) {
    $window.alert("baller!");
    $event.stopPropagation();
  };

  $scope.status = {
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
});