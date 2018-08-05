var express = require('express');
var router = express.Router();
var indexPage = require('../models/index_page');
var searchQuery = require('../models/search');

router.get('/', function (req, res, next) {
    return res.json({title: 'AuzmorSearch'});
});

router.post('/search' , function (req, res, next) {
    var searchObj = req.body.split(" ");
    searchQuery.searchPage(searchObj, function (err, result) {
        if (err){
            return res.json(err);
        }
        return res.json(result);
    });
});

router.post('/index_page', function (req, res, next) {
    var pageObj = req.body.split(" ");
    console.log('page obj is ', pageObj);
    indexPage.addPage(pageObj, function (err, result) {
        if (err){
            return res.json(err);
        }
        return res.json(result);
    });
});

module.exports = router;
