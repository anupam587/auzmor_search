var async = require('async');
const MongoClient = require('mongodb').MongoClient;
var config = require('../../config').DATABASES;

const url = config.url;
const dbName = config.db_name;
const collectionName = config.collection_name;

// to run a query we can acquire a client from the pool,
// run a query on the client, and then return the client to the pool
var getConnection = function(callback) {
    MongoClient.connect(url, function(err, client) {
        if(err){
            return callback(err, null);
        }else{
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            return callback(null, {mongo_client: client, mongo_collection: collection});
        }
    });
};

//filter { a : 2 }
//updatedValue { b : 1 }
const updateDocument = function(filter, updatedValue, callBack) {
    // Get the documents collection
    async.waterfall([
        function (cwf) {
            getConnection(function(err, result) {
                return cwf(err, result);
            });
        },
        function (mongoConn, cwf) {
            mongoConn.mongo_collection.updateOne(filter, { $set: updatedValue }, function(err, result) {
                mongoConn.mongo_client.close();
                return cwf(err, result);
            });
        }
    ], function (err, results) {
        return callBack(err, results);
    });
};

//items = [ {a : 1}, {a : 2}, {a : 3}]
const insertDocuments = function(items , callBack) {
    // Get the documents collection
    async.waterfall([
        function (cwf) {
            getConnection(function(err, result) {
                return cwf(err, result);
            });
        },
        function (mongoConn, cwf) {
            mongoConn.mongo_collection.insertMany([items], function(err, result) {
                mongoConn.mongo_client.close();
                return cwf(err, result);
            });
        }
    ], function (err, results) {
        return callBack(err, results);
    });
};

const findDocuments = function(keywordToken , callback) {
    // Get the documents collection
    async.waterfall([
        function (cwf) {
            getConnection(function(err, result) {
                return cwf(err, result);
            });
        },
        function (mongoConn, cwf) {
            mongoConn.mongo_collection.findOne(keywordToken, function(err, result) {
                mongoConn.mongo_client.close();
                return cwf(err, result);
            });
        }
    ], function (err, results) {
        return callback(err, results);
    });
};


module.exports = {
    findDocuments: findDocuments,
    insertDocuments: insertDocuments,
    updateDocument: updateDocument
};