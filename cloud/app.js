
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');

var authentication = require('cloud/require-user.js');

var projectsController = require('cloud/controllers/projects.js');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template 
app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());    // Middleware for reading request 
app.use(express.methodOverride());
app.use(express.cookieParser('SECRET_SIGNING_KEY'));
app.use(parseExpressCookieSession({
  fetchUser: true,
  key: 'image.sess',
  cookie: {
    maxAge: 3600000 * 24 * 30
  }
}));

app.get('/project/take/:name', authentication, projectsController.take);
app.get('/project/release/:name', authentication, projectsController.release);
app.get('/project/dashboard', authentication, projectsController.dashboard);

app.use('/user', require('cloud/user'));

app.use(function(req, res){
    res.redirect('/project/dashboard');
});

// Attach the Express app to Cloud Code.
app.listen();
