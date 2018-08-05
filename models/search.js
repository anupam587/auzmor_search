var async = require('async');
var _u = require('underscore');
var dbc = require('../utils/db/db_connman');
var config = require('../config');

const max_weight = config.MAX_WEIGHT;
const MAX_PAGES = config.SHOW_MAX_PAGES;

var cmp = function(a,b){
    if (a.weight != b.weight) {
        return a.weight < b.weight;
    }else{
        return a.name > b.name;
    }
};

var getTopPages = function(weightMap, callBack){
    var allPages = [];
    var outputTopPage = [];
    for(weightPage in weightMap){
        allPages.push({name: weightPage, weight: weightMap[weightPage]});
    }
    allPages = allPages.sort(cmp);
    var topPagesLen = (allPages.length > MAX_PAGES) ? MAX_PAGES : allPages.length;
    var topPages = allPages.splice(0, topPagesLen);
    for(var i =0; i< topPagesLen;i++){
        outputTopPage.push({name: topPages[i].name});
    }
    return callBack(null, outputTopPage);
};

var calculatePageWeights = function (callBack) {
    var keywordName = this.keyword_name;
    var weight = this.keyword_weight;
    var weightMap = this.weight_map;

    async.waterfall([
        function (cwf) {
            dbc.findDocuments({keyword: keywordName}, function(err, result){
                if (err){
                    return cwf(err, null);
                }else{
                    if(result && result.page_weights){
                        return cwf(err, result.page_weights);
                    }else{
                        return cwf(err, []);
                    }
                }
            });
        },
        function (allPageWeights, cwf) {
            for(var i =0; i < allPageWeights.length; i++){
                var pageWeight = allPageWeights[i];
                if (pageWeight.name in weightMap){
                    weightMap[pageWeight.name] += pageWeight.weight* weight;
                } else {
                    weightMap[pageWeight.name] = pageWeight.weight * weight;
                }
            }
            return cwf(null, weightMap);
        }
    ], function (err, results) {
        return callBack(err, results);
    });
};

var searchPage = function(searchObj, callBack){
    var weightMap = {};

    async.waterfall([
        function (cwf) {
            var value = -1;
            async.every(searchObj, function (keyWord, cfe) {
                value += 1;
                calculatePageWeights.call({
                    keyword_name: keyWord,
                    keyword_weight: max_weight - value,
                    weight_map: weightMap
                },function(err, result){
                    if(err){
                        return cfe(err, null)
                    }else{
                        weightMap = result;
                        return cfe(null, result);
                    }
                });
            }, function (asyncFEErr, allRes) {
                if(asyncFEErr){
                    return cwf(asyncFEErr, null)
                }else{
                    return cwf(null, weightMap);
                }
            });
        },
        function (pageWeights, cwf) {
            getTopPages(pageWeights, function (err, result) {
                return cwf(err, result);
            });
        }
    ], function (err, results) {
        return callBack(err, results);
    });
};

module.exports = {
    searchPage: searchPage
};
