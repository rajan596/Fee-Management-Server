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

// function getEnrollmentData(enrollment_no , cb){

//     var query = "SELECT * FROM student_data WHERE enrollment_no = ? ;" ;
//     var params = [enrollment_no];
//     var data=null;

//     sqlwrap.execute(function(err,rows){
//         if(err) {
//             throw err;
//         }
//         else {
//             console.log("Query Response : " , rows);
//             var data = makeJSONResponse(rows,enrollment_no,);
//             return cb(data);
//         }
//     },query,params);
// }

// function makeJSONResponse(data, enrollment_no){
//     //console.log(data);

//     var 
//         name        = _.get(data,'[0].name',''),
//         dob         = _.get(data,'[0].dob','') ? MOMENT(_.get(data,'[0].dob','')).format('DD-MM-YYYY') : '',
//         dueAmount   = _.get(data,'[0].due_amount',0),
//         errorcode   = "",
//         errormsg    = "";

//     // if no data found
//     if(data.length == 0) {
//         errorcode   = "102"
//         errormsg    = "Invalid Enrollment No"
//     }
//     else {
//         errorcode   = "100",
//         errormsg    = "Success"
//     }

//     var respData = {
//         "enrollment_no" : enrollment_no,
//         "name"      : name,
//         "dob"       : dob,
//         "due_amount" : dueAmount,
//         "errorcode" : errorcode,
//         "errormsg"  : errormsg
//     };

//     return respData;
// }

module.exports=router;