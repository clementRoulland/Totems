var Project = Parse.Object.extend('Project');

// Display dashboard.
exports.dashboard = function(req, res) {
	var query = new Parse.Query(Project);
	query.include("user");
	query.ascending("name");
	query.find().then(function(results) {
		res.render('project/dashboard', { 
			projects: results,
			username : Parse.User.current().get("username"),
		});
	},
	function() {
		res.send(500, 'Failed loading posts');
	});
};

exports.take = function(req, res) {

	var projectName = req.params.name;
	var query = new Parse.Query(Project);
	query.include("user");
	query.equalTo("name", projectName);
	query.first({
		success: function(theProject) {

			theProject.set("status", "busy");
			theProject.set("statusColor", "red");
			theProject.set("user", Parse.User.current());
			theProject.save();

			console.log("project " + projectName + " took by " + Parse.User.current().get("username"));

			res.redirect("/project/dashboard");
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
};


exports.release = function(req, res) {
	var projectName = req.params.name;
	var query = new Parse.Query(Project);
	query.include("user");
	query.equalTo("name", projectName);
	query.first({
		success: function(theProject) {
			if(theProject.get("user").get("username") != Parse.User.current().get("username")){
				console.log("project " + projectName + " already taken by " + theProject.get("user").get("username"));
				res.redirect("/project/dashboard");
				return;
			}

			theProject.set("status", "free");
			theProject.set("statusColor", "light-blue");
			theProject.set("user", null);
			theProject.save();

			console.log("project " + projectName + " released by " + Parse.User.current().get("username"));

			res.redirect("/project/dashboard");
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});

};