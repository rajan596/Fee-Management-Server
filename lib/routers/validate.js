var express     = require('express');
var router      = express.Router();
var Q           = require('q');
var _           = require('lodash');
var controller     = require('../controller');

router.use(function (req,res,next){
    console.log("Inside Validation Router...");
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
    var enrollmentno= _.get(req,'body.enrollmentno','');

    console.log("Rajan::: " , controller);

    new controller().getEnrollmentData( enrollmentno , function(data) {
        console.log("Response JSON Data :: ",data);
        res.status(200).send(data);
    });
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