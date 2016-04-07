/* 
File name: app.js
Server: Node JS
*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var cfenv = require("cfenv");
var fs = require('fs');
var express = require('express');
var nconf = require('nconf');
var http = require('http');
var https = require('https');

var bodyParser = require('body-parser');

global.__base = __dirname + '/';

//Application configuration environment file
nconf.argv()
    .env()
    .file({
        file: './config/app-config.json'
    });

// get the core cfenv application environment
var appEnv = cfenv.getAppEnv();
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use("/", express.static(__dirname + '/static/'));
app.use("/css", express.static(__dirname + '/static/css'));
app.use("/js", express.static(__dirname + '/static/js'));
app.use("/images", express.static(__dirname + '/static/images'));
app.use("/logs", express.static(__dirname + '/logs'));

/*Logger Declaration*/

var log4js = require('log4js');
var logger = log4js.getLogger('adapCom');

/* HTTPS SSL Support (Port:443) */
/*var secureOptions = {
    key: fs.readFileSync('config/ssl/key.pem'),
    cert: fs.readFileSync('config/ssl/cert.pem'),
    rejectUnauthorized: false
};*/

/*Router Declarations*/
var index = require(__dirname + '/routes/index'); //Generic routes
var dbroutes = require(__dirname + '/routes/dbroutes'); //db routes
var pushroutes = require(__dirname + '/routes/pushroutes'); //db routes

/* setting encoding for response */
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


/* Mapping the requests to routes (controllers) */
app.use('/', index); //Mapping for generic app requests
app.use('/db', dbroutes); //Mapping for db rest calls
app.use('/push', pushroutes); //Mapping for db rest calls


/*Top-level error handler for requests*/
app.use(function(err, req, res, next) {

    console.log(err.stack);
    var errObj = {
        status: 500,
        error: true,
        // errorName: err.name,
        // errorType: err.type,
        // errrorMessage: err.message,
        description: err.toString()
    };
    var stringifiedResponse = JSON.stringify(errObj);

    res.status(500).json(errObj);
});


/*Starting the server*/
// sets port 3000 to default or unless otherwise specified in the environment
app.set('port', process.env.VCAP_APP_PORT || process.env.PORT || nconf.get('httpPort'));

// start the server, writing a message once it's actually started
app.listen(app.get('port'), function() {
    log("server starting on port : " + app.get('port'));
});

// logger.info('HTTP Server Initiated on port %s at %s : ', httpServer.address().port, httpServer.address().address);

function log(message) {
    logger.info(appEnv.name + " : " + message);
}
