(function() {
	'use strict';

	angular
	.module('TotemsApp')
	.factory('ProjectFactory', ProjectFactory);

	ProjectFactory.$inject = ['$http'];

	function ProjectFactory($http){
		return {
            getUsers: getUsers,
			getAll: getAll,
			get: get,
			take: take,
			release: release,
		}
		
		function getUsers() {
			return $http.get('/user/list')
			.then(getAllComplete)
			.catch(getAllFailed);

			function getAllComplete(response) {
				return response.data;
			}
			function getAllFailed(error) {
				console.error('User GetAll error: ' + error.data);
			}
		};
		function getAll() {
			return $http.get('/api/project')
			.then(getAllComplete)
			.catch(getAllFailed);

			function getAllComplete(response) {
				return response.data;
			}
			function getAllFailed(error) {
				console.error('Project GetAll error: ' + error.data);
			}
		};

		function get(id) {
			return $http.get('/api/project/' + id)
			.then(getComplete)
			.catch(getFailed);

			function getComplete(response) {
				return response.data;
			}
			function getFailed(error) {
				console.error('Project Get error: ' + error.data);
			}
		};

		function take(id) {
			return $http.get('/api/project/' + id + '/take')
			.then(takeComplete)
			.catch(takeFailed);

			function takeComplete(response) {
				return response.data;
			}
			function takeFailed(error) {
				console.error('Project Take error: ' + error.data);
			}
		};

		function release(id) {
			return $http.get('/api/project/' + id + '/release')
			.then(releaseComplete)
			.catch(releaseFailed);

			function releaseComplete(response) {
				return response.data;
			}
			function releaseFailed(error) {
				console.error('Project Release error: ' + error.data);
			}
		};
	};

})();