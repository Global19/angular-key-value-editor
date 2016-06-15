angular.module("key-value-editor").run(["$templateCache", function($templateCache) {$templateCache.put("key-value-editor.html","<ng-form name=\"keyValueEditor\" novalidate>\n  <!-- may use ng-messages for better validation, if needed -->\n  <div class=\"key-value-editor\" ng-class=\"{\'cannot-delete\' : cannotDelete, \'cannot-sort\' : cannotSort}\" ng-model=\"entries\" as-sortable=\"dragControlListeners\">\n    <div class=\"key-value-editor-entry\" ng-class-odd=\"\'odd\'\" ng-class-even=\"\'even\'\" ng-repeat=\"entry in entries\" as-sortable-item>\n      <div\n        class=\"form-group key-value-editor-input\"\n        ng-class=\"{ \'has-error\' :  (keyValueEditor[\'key-\' + $id].$invalid) }\">\n        <input\n          type=\"text\"\n          class=\"form-control\"\n          id=\"key-{{$id}}\"\n          name=\"key-{{$id}}\"\n          placeholder=\"{{keyPlaceholder}}\"\n          ng-minlength=\"{{keyMinlength}}\"\n          maxlength=\"{{keyMaxlength}}\"\n          ng-model=\"entry.name\"\n          ng-focus=\"$last && onFocusLast($last, $index)\"\n          ng-readonly=\"isReadonly || entry.isReadonly\"\n          ng-pattern=\"keyValidator\">\n        <span\n          class=\"help-block\"\n          ng-show=\"(keyValueEditor[\'key-\' + $id].$error.pattern)\">\n          <span>{{ entry.keyValidatorError || keyValidatorError ||  \'validation error\' }}</span>\n        </span>\n        <span\n          class=\"help-block\"\n          ng-show=\"(keyValueEditor[\'key-\' + $id].$error.minlength)\">\n          <span>Minimum character count is {{keyMinlength}}</span>\n        </span>\n      </div>\n      <div\n        class=\"form-group key-value-editor-input\"\n        ng-class=\"(keyValueEditor[\'value-\' + $id].$invalid && keyValueEditor[\'value-\' + $id].$dirty) ? \'has-error\' : \'\'\">\n        <input\n          type=\"text\"\n          class=\"form-control\"\n          id=\"value-{{$id}}\"\n          name=\"value-{{$id}}\"\n          placeholder=\"{{valuePlaceholder}}\"\n          ng-minlength=\"{{valueMinlength}}\"\n          maxlength=\"{{valueMaxlength}}\"\n          ng-model=\"entry.value\"\n          ng-focus=\"$last && onFocusLast($last, $index)\"\n          ng-readonly=\"isReadonly || entry.isReadonly\"\n          ng-pattern=\"valueValidator\">\n        <span\n          class=\"help-block\"\n          ng-show=\"(keyValueEditor[\'value-\' + $id].$error.pattern)\">\n          <span>{{ entry.valueValidatorError || valueValidatorError ||  \'validation error\' }}</span>\n        </span>\n        <span\n          class=\"help-block\"\n          ng-show=\"(keyValueEditor[\'value-\' + $id].$error.minlength)\">\n          <span>Minimum character count is {{valueMinlength}}</span>\n        </span>\n      </div>\n      <div class=\"key-value-editor-buttons\" ng-hide=\"!cannotAdd && $last\">\n        <span\n          ng-if=\"(!cannotSort)\"\n          class=\"fa fa-bars\"\n          role=\"button\"\n          aria-label=\"Move row\"\n          aria-grabbed=\"false\"\n          as-sortable-item-handle></span>\n        <span\n          class=\"pficon pficon-close as-sortable-item-delete\"\n          role=\"button\"\n          aria-label=\"Delete row\"\n          ng-hide=\"cannotDelete || entry.cannotDelete\"\n          ng-click=\"deleteEntry($index, 1)\"></span>\n      </div>\n    </div>\n  </div>\n</ng-form>\n");}]);