/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseArray service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebaseArray) {
	var url = 'https://fiery-heat-9220.firebaseio.com/todos';
	var fireRef = new Firebase(url);
	
	var fixLocationPath = function () {
        if ($location.path() === '') {
            $location.path('/');
        }
    }
    fixLocationPath()
    
	// Bind the todos to the firebase provider.
	$scope.$on('$locationChangeSuccess', function() {
	    fixLocationPath()
    	getFireBaseArray()
	    
	    $scope.path = $location.path() // why is this not updated automatically in the $apply()?
	}, true);
	
	var getFireBaseArray = function () {
	    $scope.todos = $firebaseArray(fireRef.child($location.path()));
        $scope.newTodo = '';
        $scope.editedTodo = null;
	}
	getFireBaseArray()

	$scope.$watch('todos', function () {
		var total = 0;
		var remaining = 0;
		$scope.todos.forEach(function (todo) {
			// Skip invalid entries so they don't break the entire app.
			if (!todo || !todo.title) {
				return;
			}

			total++;
			if (todo.completed === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.completedCount = total - remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}
		$scope.todos.$add({
			title: newTodo,
			completed: false
		});
		$scope.newTodo = '';
	};
	
	$scope.toggleTodo = function (todo) {
	    todo.completed = !todo.completed
	    $scope.todos.$save(todo)
	}

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		var title = todo.title.trim();
		if (title) {
			$scope.todos.$save(todo);
		} else {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		todo.title = $scope.originalTodo.title;
		$scope.doneEditing(todo);
	};

	$scope.removeTodo = function (todo) {
		$scope.todos.$remove(todo);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos.forEach(function (todo) {
			if (todo.completed) {
				$scope.removeTodo(todo);
			}
		});
	};

	$scope.markAll = function (allCompleted) {
		$scope.todos.forEach(function (todo) {
			todo.completed = allCompleted;
			$scope.todos.$save(todo);
		});
	};
	
	$scope.submitPath = function (path) {
	    if (path[0] != "/") {
	        path = "/" + path
	    }
	    $location.path(path)
	    $scope.path = path
	}
	
	$scope.doBlur = function ($event) {
	    $event.target.blur()
	}

    $scope.path = $location.path()
	$scope.location = $location;
	
	$scope.showNotesToggle = function (todo) {
	    if (todo.showNotes) {
	        todo.showNotes = false;
	        $scope.todos.$save(todo)
	    } else {
	        todo.showNotes = true;
	    }
	}
});
