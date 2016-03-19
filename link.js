/**
*
*A unique and incremental id generator.
*/
var redis = require('redis');
var client = redis.createClient();

var linkId = require('./id');
var id = linkId.createId();

client.on('connect', function() {
    console.log('connected');
});


var getCodeByLink = function (link, callback) {
    callback = callback || function () {};
    var linkLookup = 'link:' + link;
    client.get(linkLookup, function (err, reply) {
        if (err) {
            return callback(err);
        }
        callback(null, reply); 
    });
}

var getLinkByCode = function (code, callback) {
    callback = callback || function () {};
    var codeLookup = 'code:' + code;
    client.get(codeLookup, function (err, reply) {
        if (err) {
            return callback(err);
        }
        callback(null, reply); 
    });
}

var setLink = function (link, callback) {
    callback = callback || function () {};
    var code = id.getId();
    var codeVal = "code:" + code;
    var linkVal = "link:" + link;

    client.setnx(linkVal, code, function (err, reply) {
        if (!err && reply !== 0) {
            client.set(codeVal, link, function (err1, reply1) {
                if (err1) {
                    return callback(err1);
                }

                callback(null, code);
            });
        } else {
            if (reply === 0) {
                getCodeByLink(link, function (err, res) {
                    if (!err) {
                        callback(null, res);
                    }
                })
            } else {
                callback(err);
            }

        }
    });
}


exports.link = {
    getCodeByLink: getCodeByLink,
    getLinkByCode: getLinkByCode,
    setLink:       setLink
}