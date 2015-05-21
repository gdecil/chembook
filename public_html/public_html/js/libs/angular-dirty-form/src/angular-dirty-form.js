var dirtyForm = angular.module('dirtyForm', []);

dirtyForm.constant('dirtyFormConfig', {
  // The default message to show
  message: 'Discard unsaved changes?',
  // The confirm method.
  // Defaults to $window.confirm.
  confirm: null
});

dirtyForm.run(function ($window, dirtyFormConfig) {
  dirtyFormConfig.confirm = dirtyFormConfig.confirm || function (message) {
    return $window.confirm(message);
  };
});

dirtyForm.directive('dirtyForm', function (dirtyFormLinkFn) {

  return {
    restrict: 'AE',
    require: '^form',
    link: dirtyFormLinkFn
  };

});

dirtyForm.factory('dirtyFormLinkFn', function (dirtyFormConfig, $q, $location) {

  return function ($scope, $element, $attrs, $form) {

    var forceChange = false,
      resolving = false;

    $scope.$on('$locationChangeStart', function (event, next, current) {

      if (resolving) {
        // Already resolving an async confirm.
        event.preventDefault();
      } else if ($form.$dirty && !forceChange) {

        var message = $attrs.dirtyForm || dirtyFormConfig.message;
        
        var p = dirtyFormConfig.confirm(message);

        if (p !== true) {

          // Either a promise or false result.
          // Postpone location change

          event.preventDefault();

          resolving = true;

          var resolve = function (v) {
            if (v) {
              $location.$$parse(next);
              forceChange = true;
            }
          };

          $q.when(p)
            .then(resolve)['catch'](function () {
              resolve(false);
            })['finally'](function () {
              resolving = false;
            });
        }
      }
    });

  };

});