var async = require('async');
var _u = require('underscore');
var dbc = require('../utils/db/db_connman');
var config = require('../config');

const max_weight = config.MAX_WEIGHT;

var insertPageKeyword = function (callBack) {
    var pageName = this.page_name;
    var keywordWeight = this.keyword_weight;
    var keywordName = this.keyword_name;

    async.waterfall([
        function (cwf) {
            var keywordItem = {keyword: keywordName};
            dbc.findDocuments(keywordItem, function(err, result) {
                if(result && result.page_weights){
                    return cwf(err, result.page_weights);
                }else{
                    return cwf(err, []);
                }
            });
        },
        function (pageWeights, cwf) {
            if (pageWeights.length > 0) {
                var keywordFilter = {keyword: keywordName};
                pageWeights.push({name: pageName, weight: keywordWeight});
                dbc.updateDocument(keywordFilter, {page_weights: pageWeights}, function (err, result) {
                   return cwf(err, result);
                });
            }else{
                var pageKeywordObj = {keyword: keywordName, page_weights:[{name: pageName, weight: keywordWeight}]};
                dbc.insertDocuments(pageKeywordObj, function(err, result){
                    return cwf(err, result);
                });
            }
        }
    ], function (err, results) {
        return callBack(err, results);
    });
};

var addPage = function(pageObj, callBack){
    const pageName = pageObj[0];
    pageObj.shift();
    var value = -1;
    async.every(pageObj, function (keyword, cfe) {
        value += 1;
        insertPageKeyword.call({
            page_name: pageName,
            keyword_weight: max_weight - value,
            keyword_name: keyword
        },function(err, result){
            return cfe(err, result);
        });
    }, function (asyncEveryErr, allRes) {
        if(asyncEveryErr){
            var err = {};
            err.status = 400;
            err.message = String(asyncEveryErr);
            return callBack(err, null);
        }else{
            var result = {};
            result.status = 200;
            result.message = pageName + " is added for indexing";
            return callBack(null, result);
        }
    });
};

module.exports = {
    addPage: addPage
};


