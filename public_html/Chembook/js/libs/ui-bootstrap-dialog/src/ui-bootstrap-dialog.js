var dlg = angular.module('ui.bootstrap.dialog', ['ui.bootstrap']);

var TEMPLATE_ROOT = '/ui-bootstrap-dialog/';

dlg.constant('$dialogConfig', {
  text: {
    close: 'Close',
    ok: 'Ok',
    cancel: 'Cancel'
  }
});

dlg.factory('$dialog', function ($dialogAlert, $dialogPrompt, $dialogConfirm) {

  return {
    alert: $dialogAlert,
    prompt: $dialogPrompt,
    confirm: $dialogConfirm
  };

});

dlg.factory('$dialogConfirm', function ($modal, $dialogExtendOptions) {

  return function (textOrOptions, title) {
    var options = $dialogExtendOptions(TEMPLATE_ROOT + 'dialog-confirm.ng.html', textOrOptions, title);
    return $modal.open(options);
  };

});

dlg.factory('$dialogPrompt', function ($modal, $dialogExtendOptions) {

  return function (textOrOptions, defaultValue, title) {
    var options = $dialogExtendOptions(TEMPLATE_ROOT + 'dialog-prompt.ng.html', textOrOptions, title);
    options.defaultValue = options.defaultValue || defaultValue;
    return $modal.open(options);
  };

});

dlg.factory('$dialogAlert', function ($modal, $dialogExtendOptions) {

  return function (textOrOptions, title) {
    var options = $dialogExtendOptions(TEMPLATE_ROOT + 'dialog-alert.ng.html', textOrOptions, title);
    return $modal.open(options);
  };

});

dlg.factory('$dialogExtendOptions', function ($rootScope, $dialogConfig) {

  return function (templateUrl, textOrOptions, title) {
    if (angular.isString(textOrOptions)) {
      textOrOptions = {
        text: textOrOptions
      };
    }

    var options = angular.extend({
      templateUrl: templateUrl,
      title: title || $dialogConfig.text.title,
      scope: $rootScope.$new()
    }, textOrOptions);

    options.scope.$dialog = options;
    options.scope.$config = $dialogConfig;

    return options;
  };

});

dlg.directive('dlgFocus', function ($timeout) {
  return {
    restrict: 'A',
    link: function ($scope, $element) {

      $timeout(function () {
        var e = $element[0];
        e.focus();

        if (e.tagName === 'INPUT') {
          e.setSelectionRange(0, e.value.length);
        }
      }, 100);

    }
  };
});

dlg.directive('dlgConfirm', function ($dialog, $timeout) {

  return {
    priority: -100,
    restrict: 'A',
    link: {
      pre: function ($scope, $element, $attrs) {

        var allowed = false;

        $element.on('click', function (e) {

          if (allowed) {
            allowed = false;
          } else {
            if(e.stopImmediatePropagation) {
              e.stopImmediatePropagation();  
            }
            e.preventDefault();
            
            $dialog.confirm($attrs.dlgConfirm, $attrs.dlgConfirmTitle)
              .result
              .then(function(v) {
              
              if(v) {
                allowed = true;
                $timeout(function() {
//                  $element.triggerHandler('click');  
                  $element[0].click();
                });
              }
              
            });
            
            return false;
          }          
        });
      }
    }
  };

});

dlg.config(function ($provide) {
  $provide.decorator('ngClickDirective', ['$delegate', '$parse',
    function ($delegate, $parse) {

      var directive = $delegate[0];

      directive.compile = function ($element, attr) {
        var fn = $parse(attr.ngClick);

        return function ngEventHandler(scope, element) {

          element.on('click', function ($event) {

            if (!$event.defaultPrevented) {
              var callback = function () {
                fn(scope, {
                  $event: $event
                });
              };
              scope.$apply(callback);
            }
          });

        };
      };

      return $delegate;
    }
  ]);
});