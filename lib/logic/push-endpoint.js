var nconf = require('nconf');

//Application configuration environment file
nconf.argv()
    .env()
    .file({
        file: './config/app-config.json'
    });

var dbEndPointObj = require(__base + 'lib/logic/db-endpoint.js');

/* Include various endpoint reuqests */
module.exports = {

    sendPush: function(callback) {

        var gcm = require('node-gcm');
        var message = new gcm.Message();
        // Set up the sender with you API key
        var sender = new gcm.Sender(nconf.get('gcm-api-key'));
        // message.addData('key1', 'msg1');
        // message.addData('data', 'val');
        // message.addNotification({
        //     title: 'Alert!!!',
        //     body: 'Abnormal data access',
        //     icon: 'ic_launcher'
        // });
        // console.log(message);
        // var regTokens = nconf.get('gcm-tokens');

        dbEndPointObj.getTokens(function(err, data) {

            if (err) {
                callback(err);
            }

            var regTokens = data;
            console.log("Number of tokens : " + regTokens.length);
            // console.log(regTokens);
            // Now the sender can be used to send messages
            sender.send(message, { registrationTokens: regTokens }, function(err, response) {
                if (err)
                    callback(err);
                else
                    callback(null, response);
            });
        });

        // logger.debug(text);
        // callback(new Error("ErrorName"));

    }

};
