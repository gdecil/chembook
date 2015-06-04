var app = angular.module('myApp', ['ui.bootstrap.dialog']);

app.config(function($dialogConfig) {
  $dialogConfig.text.title = 'angular-ui-dialog';
  $dialogConfig.text.close = 'Sluiten';
  $dialogConfig.text.cancel = 'Annuleren';
});

app.directive('myAppConfirmDemo', function($dialog) {
  return {
    scope: true,
    templateUrl: 'dialog-confirm-demo.html',
    link: function($scope) {
      
      $scope.title = 'Did you know?';
      $scope.text = 'Most lipsticks contain fish scales';
      
      $scope.confirm = function(text, title) {
        $dialog.confirm(text || 'No text provided', title)
          .result.then(function(value) {
            console.log('Dialog accepted: ' + value);
          })['catch'](function(reason) {
            console.log('Dialog dismissed: ' + reason);
          })['finally'](function() {
            console.log('Dialog closed');
          });
      };
    }
  };
});


app.directive('myAppAlertDemo', function($dialog) {
  return {
    scope: true,
    templateUrl: 'dialog-alert-demo.html',
    link: function($scope) {
      
      $scope.title = 'Did you know?';
      $scope.text = 'Most lipsticks contain fish scales';
      
      $scope.alert = function(text, title) {
        $dialog.alert(text || 'No text provided', title)
          .result['finally'](function() {
            console.log('Dialog closed');
          });
      };
    }
  };
});

app.directive('myAppPromptDemo', function($dialog) {
  
  return {
    scope: true,
    templateUrl: 'dialog-prompt-demo.html',
    link: function($scope) {
      
      $scope.title = 'Prompt Demo';
      $scope.text = 'Please enter something useful.';
      $scope.defaultValue = 'Something useful';
      
      $scope.prompt = function(text, defaultValue, title) {
        $dialog.prompt(text, defaultValue, title)
          .result.then(function(value) {
            console.log('Dialog accepted: ' + value);
          })['catch'](function(reason) {
            console.log('Dialog dismissed: ' + reason);
          })['finally'](function() {
            console.log('Dialog closed');
          });
      };
    }
  };
  
});

