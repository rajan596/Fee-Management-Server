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
        enrollmentno= _.get(req,'body.enrollmentno',''),
        amount      = _.get(req,'body.amount','');

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
    .then(function(data){
        var def=Q.defer();
        var txnid=_.get(req,'body.txnid','');
        self.searchTxnId(txnid,function(err,found){
            if(err) {
                def.reject(err);
            }
            else {
                if(found) {
                    def.reject(err);
                    res.status(200).send({
                        'errorcode':111,
                        'errormsg':'Duplicate Txn ID'
                    });
                }
                else {
                    return def.resolve(data);
                }
            }
        });
        return def.promise;
    })
    .then(function(data) {
        
        return self.insertPaymentData({
                'enrollment_no' : _.get(req,'body.enrollmentno',''),
                'txnid'         : _.get(req,'body.txnid',''),
                'amount'        : _.get(req,'body.amount',''),
        });
    })
    .then( function(){
        return self.clearDueAmount(enrollmentno,amount);
    })
    .then(function(){
        // success
        res.status(200).send({
            "errorcode" : "100",
            "errormsg"  : "success"
        });
    })
    .fail(function(err) {
        console.log("processPaymentRequest","failure in promise chain",err);
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

controller.prototype.processStatusCheckRequest = function(req,res){
    var self=this;
    var txnid=_.get(req,'body.txnid','');

    console.log("processStatusCheckRequest::","Checking data for txnid:",txnid);

    if(txnid === '' || txnid==null) {
        res.status(200).send({
            'errorcode':110,
            'errormsg' : "Incorrect TxnId Value"
        });
    }

    self.searchTxnId(txnid, function(err,found){
        if(err) {
            console.log("Error while::searchTxnId",txnid,err);
            res.status(200).send({
                'errorcode':105,
                'errormsg' : "Failure"
            });
        }

        console.log("Found",found);
        if(found) {
            res.status(200).send({
                'errorcode':100,
                'errormsg' : "Success"
            });
        }
        else {
            res.status(200).send({
                'error':104,
                'errormsg' : "No Txn found for this Transaction ID "
            });
        }
    });
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
controller.prototype.clearDueAmount = function (enrollmentno,amount) {
    var 
        self        = this,
        deferred    = Q.defer();

    var query = "UPDATE student_data SET due_amount=due_amount-? WHERE enrollment_no=? " ;
    var params = [amount,enrollmentno];

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

controller.prototype.searchTxnId = function(txnid,cb){
    var 
    self        = this,
    deferred    = Q.defer();

    var query = "SELECT * FROM transaction_details WHERE txnid=?;" ;
    var params = [txnid];

    self.sqlwrap.execute(function(err,rows){
        if(err) {
            cb(err,0);
            deferred.reject(err);
        }
        else {
            cb(null,rows.length); // indicated found
            deferred.resolve(rows);
        }
    },query,params);

    return deferred.promise;
}

module.exports=controller;