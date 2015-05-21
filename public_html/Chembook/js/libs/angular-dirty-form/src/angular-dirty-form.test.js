describe('angular-dirty-form', function () {

  var $scope, dirtyFormConfig, dirtyFormConfigCopy, dirtyFormLinkFn, $form = {},
    $attrs = {
      $observe: angular.noop
    },
    $compile, $q, $timeout, $location;

  beforeEach(function () {
    module('dirtyForm');

    inject(function (_$rootScope_, _$q_, _$timeout_, _$location_) {

      $scope = _$rootScope_.$new();
      $q = _$q_;
      $timeout = _$timeout_;
      $location = _$location_;

      $location.$$parse = function(url) {
        $location.$$path = url;
      };
      
    });

    inject(function (_dirtyFormLinkFn_, _dirtyFormConfig_) {

      dirtyFormConfig = _dirtyFormConfig_;
      dirtyFormConfigCopy = angular.copy(dirtyFormConfig);

      dirtyFormLinkFn = _dirtyFormLinkFn_;

    });

    inject(function (_$compile_) {

      $compile = _$compile_;

    });

  });

  afterEach(function () {

    angular.copy(dirtyFormConfigCopy, dirtyFormConfig);

  });

  describe('directive', function () {


    it('should compile on form element', function () {

      // Arrange

      var template = '<form dirty-form></form>';

      // Act

      $compile(template)($scope);

      // Assert

      $scope.$digest();

    });

    it('should compile as form child element', function () {

      // Arrange

      var template = '<form><div dirty-form></div></form>';

      // Act

      $compile(template)($scope);

      // Assert

      $scope.$digest();

    });

    it('should use the default message to confirm', function () {

      // Arrange

      dirtyFormConfig.message = 'default message';
      spyOn(dirtyFormConfig, 'confirm');
      var template = '<form><div dirty-form></div></form>';

      var $element = $compile(template)($scope);
      $scope.$digest();

      $form = $element.controller('form');
      $form.$setDirty();

      // Act

      $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(dirtyFormConfig.confirm).toHaveBeenCalledWith('default message');

    });

    it('should use the message from the attribute', function () {

      // Arrange

      spyOn(dirtyFormConfig, 'confirm');
      var template = '<form><div dirty-form="attribute message here"></div></form>';

      var $element = $compile(template)($scope);
      $scope.$digest();

      $form = $element.controller('form');
      $form.$setDirty();

      // Act

      $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(dirtyFormConfig.confirm).toHaveBeenCalledWith('attribute message here');

    });

  });

  describe('directive link', function () {

    it('should call the configured confirm on location change when form is dirty', function () {

      // Arrange

      $form.$dirty = true;
      spyOn(dirtyFormConfig, 'confirm');
      dirtyFormLinkFn($scope, null, $attrs, $form);

      // Act

      $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(dirtyFormConfig.confirm).toHaveBeenCalled();

    });

    it('should NOT call the configured confirm on location change when form is NOT dirty', function () {

      // Arrange

      $form.$dirty = false;
      spyOn(dirtyFormConfig, 'confirm');
      dirtyFormLinkFn($scope, null, $attrs, $form);

      // Act

      $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(dirtyFormConfig.confirm).not.toHaveBeenCalled();

    });

    it('should call the configured confirm with config message', function () {

      // Arrange

      $form.$dirty = true;
      dirtyFormConfig.message = "the message";
      spyOn(dirtyFormConfig, 'confirm');
      dirtyFormLinkFn($scope, null, $attrs, $form);

      // Act

      $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(dirtyFormConfig.confirm).toHaveBeenCalledWith("the message");

    });

    it('should call the configured confirm with attribute message', function () {

      // Arrange

      $form.$dirty = true;
      $attrs.dirtyForm = "attribute message!";
      $attrs.$observe = function (a, fn) {
        fn($attrs.dirtyForm);
      };

      spyOn(dirtyFormConfig, 'confirm');
      dirtyFormLinkFn($scope, null, $attrs, $form);

      // Act

      $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(dirtyFormConfig.confirm).toHaveBeenCalledWith("attribute message!");

    });

    it('should not prevent the location change if the confirm is confirmed', function () {

      // Arrange

      $form.$dirty = true;
      dirtyFormConfig.confirm = function () {
        return true;
      };

      dirtyFormLinkFn($scope, null, $attrs, $form);

      // Act

      var event = $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(event.defaultPrevented).toBe(false);

    });

    it('should prevent the location change if the confirm is not confirmed', function () {

      // Arrange

      $form.$dirty = true;
      dirtyFormConfig.confirm = function () {
        return false;
      };

      dirtyFormLinkFn($scope, null, $attrs, $form);

      // Act

      var event = $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(event.defaultPrevented).toBe(true);

    });

    it('should not prevent the location change if form is not dirty', function () {

      // Arrange

      $form.$dirty = false;
      dirtyFormConfig.confirm = function () {
        throw new Error('should also not been called');
      };

      dirtyFormLinkFn($scope, null, $attrs, $form);

      // Act

      var event = $scope.$broadcast('$locationChangeStart');

      // Assert

      expect(event.defaultPrevented).toBe(false);

    });

    // ------------------- async promises -----------------------------------

    describe('Async promises', function () {

      it('should postpone the location change in case of a promise result', function () {

        // Arrange

        $form.$dirty = true;
        dirtyFormConfig.confirm = function (msg) {
          var d = $q.defer();
          return d.promise;
        };

        dirtyFormLinkFn($scope, null, $attrs, $form);

        // Act

        var event = $scope.$broadcast('$locationChangeStart');

        // Assert

        expect(event.defaultPrevented).toBe(true);

      });
      
      it('should resume the location change whenever the promise resolves to true', function () {

        // Arrange

        $form.$dirty = true;
        dirtyFormConfig.confirm = function (msg) {
          var d = $q.defer();
          
          $timeout(function() {
            d.resolve(true);
          }, 1000);
          
          return d.promise;
        };

        dirtyFormLinkFn($scope, null, $attrs, $form);

        // Act

        var event = $scope.$broadcast('$locationChangeStart', '/new-url', '/old-url');
        $timeout.flush();

        // Assert
      
        expect($location.path()).toBe('/new-url');

      });
      
      it('should not allow location change if a confirm is in progress', function () {

        // Arrange

        $form.$dirty = true;
        
        var syncConfirm = function() {
          throw new Error('Should not call any confirm when an async confirm is in progress');
        };
        
        var asyncConfirm = function() {
          var d = $q.defer();
          
          return d.promise;
        };
          
        dirtyFormLinkFn($scope, null, $attrs, $form);

        // Act

        dirtyFormConfig.confirm = asyncConfirm; // Start the async confirm
        var asyncEvent = $scope.$broadcast('$locationChangeStart', '/new-url', '/old-url');
        
        dirtyFormConfig.confirm = syncConfirm; // Start the async confirm
        var syncEvent = $scope.$broadcast('$locationChangeStart', '/new-url2', '/old-url');
        
        // Assert
      
        expect(syncEvent.defaultPrevented).toBe(true);

      });
      
    });

  });

});