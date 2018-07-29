var sqlwrap     = require('./sqlwrapper'),
    _           = require('lodash'),
    Q           = require('q');
    MOMENT      = require('moment');

function controller(){
    var self=this;

    self.sqlwrap = new sqlwrap();
}

controller.prototype.getEnrollmentData = function (enrollment_no , cb){
    var self=this;

    var query = "SELECT * FROM student_data WHERE enrollment_no = ? ;" ;
    var params = [enrollment_no];
    var data=null;

    self.sqlwrap.execute(function(err,rows){
        if(err) {
            throw err;
        }
        else {
            console.log("Query Response : " , JSON.stringify(rows));
            var data = self.makeJSONResponse(rows,enrollment_no);
            return cb(data);
        }
    },query,params);
}

controller.prototype.makeJSONResponse = function(data, enrollment_no){
    //console.log(data);

    var 
        name        = _.get(data,'[0].name',''),
        dob         = _.get(data,'[0].dob','') ? MOMENT(_.get(data,'[0].dob','')).format('DD-MM-YYYY') : '',
        dueAmount   = _.get(data,'[0].due_amount',0),
        errorcode   = "",
        errormsg    = "";

    // if no data found
    if(data.length == 0) {
        errorcode   = "102"
        errormsg    = "Invalid Enrollment No"
    }
    else {
        errorcode   = "100",
        errormsg    = "Success"
    }

    var respData = {
        "enrollment_no" : enrollment_no,
        "name"      : name,
        "dob"       : dob,
        "due_amount" : dueAmount,
        "errorcode" : errorcode,
        "errormsg"  : errormsg
    };

    return respData;
}

controller.prototype.processPaymentRequest = function(req,res) {
    var
        self        =   this,
        deferred    =   Q.defer();
        enrollmentno= _.get(req,'body.enrollmentno','');

    Q(undefined)
    .then(function(){
        self.getEnrollmentData( enrollmentno , function(data) {
            console.log("Response JSON Data :: ", JSON.stringify(data));
            
            // success validation case
            if( _.get(data,'errorcode','') === '100') {
                return Q(data);
                //res.status(200).send("okk");
            }
            else {
                res.status(200).send(data);
            }
        });
    })
    .then(function(data) {
        
        return self.insertPaymentData({
                'enrollment_no' : _.get(req,'body.enrollmentno',''),
                'txnid'         : _.get(req,'body.txnid',''),
                'amount'        : _.get(req,'body.amount',''),
        });
    })
    .then( function(){
        return self.clearDueAmount(enrollmentno);
    })
    .then(function(){
        // success
        res.status(200).send({
            "errorcode" : "100",
            "errormsg"  : "success"
        });
    })
    .fail(function(err) {
        console.err("processPaymentRequest","failure in promise chain",err);
        res.status(200).send({
            "errorcode" : "105",
            "errormsg"  : "failure"
        });
    })
    .catch( function(err) {
        console.log("Error " , err);
    });

    return deferred.promise;
}    

// insert payment data into transaction_details table
controller.prototype.insertPaymentData = function (data) {
    var 
        self        = this,
        deferred    = Q.defer();

    var query = "INSERT INTO transaction_details (enrollment_no,txnid,amount) VALUES (?,?,?);" ;

    var params = [data.enrollment_no,data.txnid, data.amount];

    self.sqlwrap.execute(function(err,rows){
        if(err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(null);
        }
    },query,params);

    return deferred.promise;
}

// marks due amount = 0 of given enrollment_no
controller.prototype.clearDueAmount = function (enrollmentno) {
    var 
        self        = this,
        deferred    = Q.defer();

    var query = "UPDATE student_data SET due_amount=0 WHERE enrollment_no=? " ;
    var params = [enrollmentno];

    self.sqlwrap.execute(function(err,rows){
        if(err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(null);
        }
    },query,params);

    return deferred.promise;
}

module.exports=controller;