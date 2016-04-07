var express = require('express');
var router = express.Router();

/* Include various endpoints for making requests */
var endpointObj = require(__base + 'lib/logic/db-endpoint.js');

/* Mapping for default request */
router.get('/', function(req, res) {
    res.send('db API page');
});

router.get('/collections', function(req, res, next) {

    endpointObj.listCollections(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

router.get('/getTokens', function(req, res, next) {

    endpointObj.getTokens(function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

router.post('/addToken', function(req, res, next) {
    
    console.log("addToken POST call received");

    var tokenid = req.body.tokenid;
    if (!tokenid) {
        console.log("tokenid parameter empty");
        tokenid = "eno-PmPrUfQ:APA91bFYOqU0M9AwTzKd3JyM840ktkAiC2dmVDaKYl1uIMQ1efC0bpqT--5roavgqNsaGDWn5cHXXBNSFoDoXEvEqtZDtNU_cqQM7GLvE0lm03YkxXGVhzKGa2QRvhTXAj4AkzeUxCTY";
    }
    endpointObj.addToken(tokenid, function(err, data) {

        if (err) {
            next(err);
        }
        res.json(data);
    });

});

module.exports = router;
