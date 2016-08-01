/*global todomvc */
'use strict';

/**
 * Directive that executes an expression when the element it is applied to gets
 * an `escape` keydown event.
 */
todomvc.directive('todoEscape', function () {
	var ESCAPE_KEY = 27;
	return function (scope, elem, attrs) {
		elem.bind('keydown', function (event) {
			if (event.keyCode === ESCAPE_KEY) {
				scope.$apply(attrs.todoEscape);
				
				if(scope.$eval(attrs.ngBlurOnEsc)){
                    elem[0].blur()
                }
			}
		});

		scope.$on('$destroy', function () {
			elem.unbind('keydown');
		});
	};
});
