(function() {
  'use strict';
  angular.module('key-value-editor', ['as.sortable']);
})();

(function() {
  'use strict';

  angular
    .module('key-value-editor')
    .directive('keyValueEditor', [
      'keyValueEditorConfig',
      function(keyValueEditorConfig) {
        // a few utils
        var addEmptyEntry = function(entries) {
          entries && entries.push({name: '', value: ''});
        };
        var last = function(entries) {
          return entries[entries.length - 1];
        };
        // this is a minimal get w/o deep paths
        var get = function(obj, prop) {
          return obj && obj[prop];
        };
        return {
          restrict: 'AE',
          scope: {
            // {
            //  name: 'foo',
            //  value: 'bar',
            //  isReadOnly: true|| false      // individual entries may be readonly
            //  cannotDelete: true || false   // individual entries can be permanent
            //  keyValidator: '',             // regex string
            //  valueValidator: ''            // regex string
            //  keyValidatorError: '',        // custom validation error
            //  valueValidatorError: ''       // custom validation error
            // }
            entries: '=?',
            keyPlaceholder: '@',
            valuePlaceholder: '@',
            keyValidator: '@',                // general key regex validation string
            valueValidator: '@',              // general value regex validation string
            keyValidatorError: '@',           // general key validation error message
            valueValidatorError: '@',         // general value validation error message
            cannotAdd: '=?',
            cannotDelete: '=?',
            cannotSort: '=?',
            isReadonly: '=?'
          },
          link: function($scope, $elem, $attrs) {
            // ensure a default
            $scope.entries = $scope.entries || [];
            // if an attribute exists, set its corresponding bool to true
            if('cannotAdd' in $attrs) {
              $scope.cannotAdd = true;
            }
            if('cannotDelete' in $attrs) {
              $scope.cannotDelete = true;
            }
            if('isReadonly' in $attrs) {
              $scope.isReadonly = true;
            }
            if('cannotSort' in $attrs) {
              $scope.cannotSort = true;
            }

            $scope.keyValidator = keyValueEditorConfig.keyValidator || $attrs.keyValidator;
            $scope.valueValidatorError = keyValueEditorConfig.valueValidatorError || $attrs.valueValidatorError;
            $scope.keyValidatorError = keyValueEditorConfig.keyValidatorError || $attrs.keyValidatorError;
            $scope.valueValidatorError = keyValueEditorConfig.valueValidatorError || $attrs.valueValidatorError;

            // ensure that there is at least one empty input for the user
            // NOTE: if the data source 'entries' is shared between two instances
            // and one of them has 'can add', the addEmptyEntry() function runs.
            // and then we are all confused.
            if(!$scope.cannotAdd && (get(last($scope.entries), 'name') !== '')) {
              addEmptyEntry($scope.entries);
            }
          },
          controller: [
            '$scope',
            function($scope) {
              // will add a new text input every time the last
              // set is selected.
              $scope.onFocusLast = function() {
                if (!$scope.cannotAdd && !$scope.isReadonly) {
                  addEmptyEntry($scope.entries);
                }
              };
              // clicking the delete button removes the pair
              $scope.deleteEntry = function(start, deleteCount) {
                $scope.entries.splice(start, deleteCount);
              };
              $scope.dragControlListeners = {
                  // only allow sorting within the parent instance
                  accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                  },
                  orderChanged: function(event) {
                    // don't allow sorting past the empty pair if empty pair exist
                    if(event.dest.index === (event.dest.sortableScope.modelValue.length - 1) && !$scope.cannotAdd) {
                      event.dest.sortableScope.removeItem(event.dest.index);
                      event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.modelValue);
                    }
                  }

              };
            }
          ],
          // as a fn in case we want to allow configurable templates
          templateUrl: function() {
            return 'key-value-editor.html';
          }
        };
      }]);

})();

(function() {
  'use strict';
  angular
    .module('key-value-editor')
    .provider('keyValueEditorConfig', [
      function() {
        var defaults = {
          keyValidator: '[a-zA-Z0-9-_]+',   // alphanumeric, with dash & underscores
          valueValidator: '',               // values have no default validation
          keyValidatorError: undefined,     // default error message string
          valueValidatorError: undefined    // default error message string
        };

        // set a new default key value pair, or pass an object to replace
        // multiple keys.
        // example 1:
        //  keyValueEditorConfigProvider.set('keyValidator', '\S*') // no white space
        // example 2:
        //  keyValueEditorConfigProvider.set({
        //      keyValidator: '[a-zA-Z0-9]+',  // alphanumberic,
        //      keyValidatorError: 'key must be alphanumeric only'
        //  });
        this.set = function(key, value) {
          if(angular.isObject(key)) {
            angular.extend(defaults, key);
          } else {
            console.log('replace defaults', '');
            defaults[key] = value;
          }
        };

        this.$get = [
          function() {
            return defaults;
          }
        ];
      }
    ]);
})();
