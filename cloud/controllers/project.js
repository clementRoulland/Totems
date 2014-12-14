module.exports = function(){
	var express = require('express');
	var app = express();
	var Project = Parse.Object.extend('Project');
	var authentication = require('cloud/tools/require-user.js');

	app.get('/', authentication, getAll);
	app.get('/:id', authentication, get);
	app.get('/:id/take', authentication, take);
	app.get('/:id/release', authentication, release);

	function getAll(res, res){
		var query = new Parse.Query(Project);
		query.include("user");
		query.find({
			success: function(results) {
				var projects = new Array();
				results.forEach(function(iteratedProject){
					var project = toJSON(iteratedProject);
					projects.push(project);
				});
				console.log(projects);
				res.json(projects);
			},
			error: function(error) {
				console.log(error);
				error.status = 'ko';
				res.json(error);
			}
		});
	};

	function get(req, res){
		var projectId = req.params.id;
		var query = new Parse.Query(Project);
		query.include("user");
		query.get(projectId, {
			success: function(theProject) {
				res.json(toJSON(theProject));
			},
			error: function(object, error) {
				console.error(error);
				error.status = 'ko';
				res.json(error);
			}
		});
	};

	function take(req, res){

		console.log('TAKE TA MERE !!!!!!!!!!!!');

		var projectId = req.params.id;
		var query = new Parse.Query(Project);
		query.include("user");
		query.get(projectId, {
			success: function(theProject) {
				theProject.set("user", Parse.User.current());
				theProject.save();

				var project = toJSON(theProject);
				project.status = 'ok';

				console.log("project " + theProject.get('name') + " took by " + Parse.User.current().get("username"));
				res.json(project);
			},
			error: function(object, error) {
				console.error(error);
				error.status = 'ko';
				res.json(error);
			}
		});
	};

	function release(req, res){
		var projectId = req.params.id;
		var query = new Parse.Query(Project);
		query.include("user");
		query.get(projectId, {
			success: function(theProject) {
				theProject.set("user", null);
				theProject.save();

				var project = toJSON(theProject);
				project.status = 'ok';

				console.log("project " + theProject.get('name') + " released by " + Parse.User.current().get("username"));
				res.json(project);
			},
			error: function(object, error) {
				console.error(error);
				error.status = 'ko';
				res.json(error);
			}
		});
	};

	function toJSON(project){
		return {
			id: project.id,
			name: project.get('name'),
			type: project.get('type'),
			stack: project.get('stack'),
			user: project.get('user')?{
				username: project.get('user').get('username'),
				id: project.get('user').id,
			}:undefined,
		};

	}

	return app;
}();