var app = angular.module('myApp', ['ngRoute', 'dirtyForm', 'inform', 'ngAnimate', 'ui.bootstrap', 'ui.bootstrap.dialog']);

// - - - - - 8-< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Supply our demo app some routes
// Note: dirtyForm doesn't depend on routing.
// - - - - - 8-< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

app.config(function ($routeProvider) {

  $routeProvider.when('/', {
    text: 'Home',
    templateUrl: '/demo/default.html'
  });

  $routeProvider.when('/view1', {
    text: 'View 1',
    templateUrl: '/demo/view1.html'
  });

  $routeProvider.when('/view2', {
    text: 'View 2',
    templateUrl: '/demo/view2.html'
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

});

// - - - - - 8-< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

app.controller('View1Ctrl', function ($scope, $location, inform) {

  // Note: the form controller is exposed on the scope by the view by setting the name
  // property. <form name="form.ctrl">

  $scope.save = function () {

    // Set the form to pristine state so we're not prompting the user to save
    // the changes when changing the location.

    $scope.form.ctrl.$setPristine(true);
    inform.add('Form data saved');
    $location.path('/');
  };

});

// - - - - - 8-< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

app.controller('View2Ctrl', function ($scope, $location, inform) {

  // Note: the form controller is exposed on the scope by the view by setting the name
  // property. <form name="form.ctrl">

  $scope.send = function () {

    // Set the form to pristine state so we're not prompting the user to save
    // the changes when changing the location.

    $scope.form.ctrl.$setPristine(true);
    inform.add('Message send');
    $location.path('/');
  };

});

// - - - - - 8-< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// The main controller. This is just here to setup the demo and can be ignored.
// - - - - - 8-< - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

app.controller('MainCtrl', function ($scope, $location, $route, dirtyFormConfig, $dialog, $modal, $window) {

  $scope.config = dirtyFormConfig;
  $scope.config.defaultMessage = dirtyFormConfig.message;
  $scope.config.async = true;
  $scope.config.visible = false;
  $scope.config.title = 'There are unsaved changes';

  $scope.routes = [];

  angular.forEach($route.routes, function (route, key) {
    if (key && !route.redirectTo) {
      $scope.routes.push(route);
    }
  });

  $scope.isActiveRoute = function (route) {
    return $route.current && $route.current.$$route === route;
  };

  $scope.$watch('config.visible', function (value) {

    if (value) {
      var modalInstance = $modal.open({
        templateUrl: '/demo/config.html',
        scope: $scope,
        size: 'lg'
      }).result['finally'](function () {
        $scope.config.visible = false;
      });
    }

  });

  function customConfirm(msg) {
    return $dialog.confirm(msg, $scope.config.title).result;
  }

  function defaultConfirm(msg) {
    return $window.confirm(msg);
  }

  $scope.$watch('config.async', function (value) {

    if (value) {
      $scope.config.confirm = customConfirm;
    } else {
      $scope.config.confirm = defaultConfirm;
    }

  });

  $scope.getExampleCode = function () {

    var msgMod = $scope.config.message !== $scope.config.defaultMessage;
    var confirmMod = $scope.config.confirm !== defaultConfirm;

    if (msgMod || confirmMod) {
      var c = 'app.run(function(dirtyFormConfig' + (confirmMod ? ', $dialog' : '') + ') {\n\n';

      if (msgMod) {
        c +=
          '  // Set the default message to be shown\n\n' +
          '  dirtyFormConfig.message = \'' + $scope.config.message + '\';\n\n';
      }

      if (confirmMod) {
        c +=
          '  // Override the default $window.confirm with a custom confirm dialog.\n' +
          '  // Note: promises are supported.\n\n' +
          '  dirtyFormConfig.confirm = function(message) {\n' +
          '    return $dialog.confirm(message, \'' + $scope.config.title + '\').result;\n' +
          '  };\n\n';
      }

      c += '});';

      return c;
    } 
  };
});