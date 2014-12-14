module.exports = function(){
	var express = require('express');
	var app = express();
	var Project = Parse.Object.extend('Project');
	var authentication = require('cloud/tools/require-user.js');
	var _ = require('underscore');

	app.get('/', authentication, getAll);
	app.get('/:id', authentication, get);
	app.get('/:id/take', authentication, take);
	app.get('/:id/release', authentication, release);

	function getAll(res, res){
		var query = new Parse.Query(Project);
		query.include("user");
		query.include("stack.user");
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
			error: error
		});
	};

	function get(req, res){
		var projectId = req.params.id;
		var query = new Parse.Query(Project);
		query.include("user");
		query.include("stack.user");
		query.get(projectId, {
			success: function(theProject) {
				res.json(toJSON(theProject));
			},
			error: error
		});
	};

	function take(req, res){
		var projectId = req.params.id;
		var query = new Parse.Query(Project);
		query.include("user");
		query.include("stack.user");
		query.get(projectId, {
			success: success,
			error: error
		});

		function success(theProject){

			if(!theProject.get('stack')){
				theProject.set('stack', []);
			}

			if( theProject.get('user') && theProject.get('user') != Parse.User.current() && !userIsInStack(Parse.User.current(), theProject.get('stack')) ){
				// add user to stack
				theProject.get('stack').push(Parse.User.current());
				console.log("Project::take | " + Parse.User.current().get("username") + " add to stack for project " + theProject.get('name'));
			}else if(!theProject.get('user')){
				// take project
				theProject.set("user", Parse.User.current());
				console.log("Project::take | " + Parse.User.current().get("username") + " take project " + theProject.get('name'));
			}
			theProject.save();

			res.json(toJSON(theProject));
		}
	};

	function release(req, res){
		var projectId = req.params.id;
		var query = new Parse.Query(Project);
		query.include("user");
		query.include("stack.user");
		query.get(projectId, {
			success: success,
			error: error,
		});

		function success(theProject) {

			if( theProject.get('user') && theProject.get('user').id == Parse.User.current().id ){
				console.log("Project::release | " + Parse.User.current().get("username") + " release project " + theProject.get('name'));
				if(theProject.get('stack').length > 0){
					theProject.set('user', theProject.get('stack').shift());
					console.log("Project::release | " + Parse.User.current().get("username") + " take project " + theProject.get('name') + " from stack");
				}else{
					theProject.set("user", null);
				}
			}else if(userIsInStack(Parse.User.current(), theProject.get('stack'))){
				// take project
				var indexInStack = userIsInStack(Parse.User.current(), theProject.get('stack'))-1;
				theProject.get('stack').splice(indexInStack,1);
				console.log("Project::release | " + Parse.User.current().get("username") + " release project " + theProject.get('name') + " from stack " + indexInStack);
			}
			theProject.save();

			res.json(toJSON(theProject));
		}
	};

	function toJSON(project){
		return {
			id: project.id,
			name: project.get('name'),
			type: project.get('type'),
			stack: project.get('stack'),
			user: project.get('user'),
		};
	}

	function userIsInStack(user, stack){
		console.log("Project::userIsInStack | stack | ");
		console.log(stack);
		console.log("Project::userIsInStack | user | ");
		console.log(user);
		var isInStack = false;
		var indexInStack = 0;
		stack.forEach(function(it){
			console.log("Project::userIsInStack | it.id | " + it.id);
			if(it.id == user.id){
				console.log("Project::userIsInStack | it.id == user.id | " + it.id + " == " + user.id);
				isInStack = true;
			}
			if(!isInStack)indexInStack++;
		});
		return isInStack?indexInStack+1:false;
	}

	function error(object, error) {
		console.error(error);
		error.status = 'ko';
		res.json(error);
	}

	return app;
}();