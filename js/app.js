/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var todomvc = angular.module('todomvc', ['firebase']);

todomvc.filter('todoFilter', function ($location) {
	return function (input) {
		var filtered = {};
		angular.forEach(input, function (todo, id) {
			var path = $location.hash();
			if(typeof todo.completed !== 'undefined'){
                if (path === 'active') {
                    if (!todo.completed) {
                        filtered[id] = todo;
                    }
                } else if (path === 'completed') {
                    if (todo.completed) {
                        filtered[id] = todo;
                    }
                } else {
                    filtered[id] = todo;
                }
            }
		});
		return filtered;
	};
});

todomvc.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
                
                if(scope.$eval(attrs.ngBlurOnEnter)){
                    element[0].blur()
                }
            };
        });
    };
});
    
