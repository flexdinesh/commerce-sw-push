var express = require('express');
var router = express.Router();

/* Include various endpoints for making requests */
var pushEndPointObj = require(__base + 'lib/logic/push-endpoint.js');
var dbEndPointObj = require(__base + 'lib/logic/db-endpoint.js');

/* Mapping for default request */
router.get('/', function(req, res) {
    res.send('push API page');
});

router.post('/sendPush', function(req, res, next) {

    console.log("sendPush POST call received");

    pushEndPointObj.sendPush(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

router.get('/getPushMessage', function(req, res, next) {

    console.log("getPushMessage GET call received");

    dbEndPointObj.getPushMessage(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

router.post('/setPushMessage', function(req, res, next) {

    console.log("setPushMessage POST call received");

    var title = req.body.title ? req.body.title : 'Notification title';
    var body = req.body.body ? req.body.body : 'Notification content goes here';
    var icon = req.body.icon ? req.body.icon : 'images/icon.png';
    var uri = req.body.url ? req.body.url : 'uri goes here';

    message = {
        title: title,
        body: body,
        icon: icon,
        url: uri
    };

    dbEndPointObj.setPushMessage(message, function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

module.exports = router;
