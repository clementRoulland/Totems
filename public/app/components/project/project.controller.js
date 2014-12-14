(function() {
	'use strict';

	angular
	.module('TotemsApp')
	.controller('ProjectController', ProjectController);

	ProjectController.$inject = ['projectsPromise', 'ProjectFactory', '$interval'];

	function ProjectController(projectsPromise, ProjectFactory, $interval) {
		var vm = this;
		vm.projects = projectsPromise;
		vm.take = take;
		vm.release = release;
		vm.userIsInStack = userIsInStack;
		$interval(refresh, 60000);

		function take(project){
			var index = vm.projects.indexOf(project);
			ProjectFactory.take(project.id)
			.then(function(data){
				console.log(data);
				vm.projects[index] = data;
			})
			.catch();
		};

		function release(project){
			var index = vm.projects.indexOf(project);
			ProjectFactory.release(project.id)
			.then(function(data){
				console.log(data);
				vm.projects[index]= data;
			})
			.catch();
		};

		function refresh(){
			ProjectFactory.getAll().then(function(data){
				vm.projects = data;
			})
			.catch();
		}

		function userIsInStack(user, stack){
			var isInStack = false;
			stack.forEach(function(it){
				if(it.objectId == user.objectId){
					isInStack = true;
					return;
				}
			});
			return isInStack;
		}
	};

})();
