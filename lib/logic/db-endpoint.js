var nconf = require('nconf');
//Application configuration environment file
nconf.argv()
    .env()
    .file({
        file: './config/app-config.json'
    });

var mongodb = require('mongodb');
var MONGODB_URI = nconf.get('db-url');
var db;
var tokens;
var pushdata;

var assert = require('assert');

// Initialize connection once

mongodb.MongoClient.connect(MONGODB_URI, function(err, database) {
    if (err) throw err;

    db = database;

    // pushdata = db.collection('pushdata');
    // tokens = db.collection('tokens')

});

/* Include various endpoint requests */
module.exports = {

    listCollections: function(callback) {

        var resp = [];

        db.collections(function(err, collections) {
            collections.forEach(function(collection) {
                var name = collection['s']['name'];
                resp.push(name);
            });

            callback(null, resp);
        });

    },

    getTokens: function(callback) {

        tokens = db.collection('tokens');
        var resp = [];

        tokens.find({}, function(err, docs) {

            console.log("getTokens db call made");

            docs.each(function(err, doc) {
                if (doc) {
                    // console.log(JSON.stringify(doc) + "\n");
                    resp.push(doc['tokenid']);
                } else {
                    callback(null, resp);
                }
            });
        });

    },

    addToken: function(tokenid, callback) {

        tokens = db.collection('tokens');

        var resp = { res: 'val' };

        tokens.findAndModify({ tokenid: tokenid }, [], {
                $setOnInsert: { tokenid: tokenid } // insert the document if it does not exist
            }, { upsert: true, new: true },
            function(err, result) {
                assert.equal(null, err);
                callback(null, result);
            });

    },

    setPushMessage: function(message, callback) {

        pushdata = db.collection('pushdata');

        var resp = { res: 'val' };
        var pushid = 'static-id';

        pushdata.findAndModify({ pushid: 'static-id' }, [], {
                $set: { message: message }
            }, { upsert: true, new: true },
            function(err, result) {
                assert.equal(null, err);
                callback(null, result);
            });

    },

    getPushMessage: function(callback) {

        pushdata = db.collection('pushdata');
        var resp = {};

        pushdata.find({ pushid: 'static-id' }, function(err, docs) {
            docs.each(function(err, doc) {

                if (err)
                    callback(err);

                if (doc) {
                    // console.log(JSON.stringify(doc) + "\n");
                    resp = doc['message'];
                } else {
                    callback(null, resp);
                }
            });
        });

    },

};
