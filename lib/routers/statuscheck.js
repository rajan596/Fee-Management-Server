var express     = require('express');
var Q           = require('q');
var _           = require('lodash');
var controller     = require('../controller');

var router      = express.Router();
controller         = new controller();

router.use(function (req,res,next){
    console.log("Inside Statusckeck Router...");
    next();
});

router
.get('', function (req,res){
    res.status(200).send({
        'errorcode' : '101',
        'errormsg' : 'Invalid Request type GET'
    });
})
.post('', function (req,res){
    controller.processStatusCheckRequest(req,res);
})
.put('', function (req,res){
    res.status(200).send({
        'errorcode' : '101',
        'errormsg' : 'Invalid Request type PUT'
    });
})
.delete('', function (req,res){
    res.status(200).send({
        'errorcode' : '101',
        'errormsg' : 'Invalid Request type DELETE'
    });
});

module.exports=router;