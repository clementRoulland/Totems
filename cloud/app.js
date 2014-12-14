
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var authentication = require('cloud/tools/require-user.js');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template 
app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());    // Middleware for reading request 
app.use(express.methodOverride());
app.use(express.cookieParser('D!g!tal&o_T0t&ms'));
app.use(parseExpressCookieSession({
  fetchUser: true,
  key: 'image.sess',
  cookie: {
    maxAge: 3600000 * 24 * 30
  }
}));

app.get('/', authentication, function(res, res){
	res.render('index', {
		user: Parse.User.current(),
	});
});

app.use('/api/project', require('cloud/controllers/project'));
app.use('/user', require('cloud/controllers/user'));

app.use(function(req, res){
    res.redirect('/');
});

// Attach the Express app to Cloud Code.
app.listen();
