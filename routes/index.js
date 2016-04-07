var express = require('express');
var router = express.Router();

/* Include various endpoints for making requests */

var endpointObj = require(__base + 'lib/logic/push-endpoint.js');


/* Mapping for default request */

router.get('/', function(req, res) {
    // res.send('Node Application is running');
    res.render('index', {
        title: "I am a title",
        welcomeText: "my page"
    });
});

router.get('/sampleJsonResponse', function(req, res, next) {
    logger.debug("sampleJsonResponse block executed");

    endpointObj.sample(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

router.get('/sampleViewResponse', function(req, res, next) {
    logger.debug("sampleViewResponse block executed");

    res.render('index', {
        title: "I am a title",
        welcomeText: "my page"
    });

});

module.exports = router;
