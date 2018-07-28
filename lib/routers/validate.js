const express   = require('express');
const router    = express.Router();
const Q         = require('q');

router.use(function (req,res,next){
    console.log("Calling Validation Router...");
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

    var responseData = getEnrollmentData();

    res.status(200).send(responseData);
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

function getEnrollmentData(){
    var data = {
        "name" : "test1",
        "dob"  : "12-05-1879",
        "dueAmount" : 1000,
        "errorcode" : "100",
        "errormsg"  : "success"
    };
    return data;
}

module.exports=router;

