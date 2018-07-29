var sql     = require('mysql');
var fs      = require('fs');
var Q       = require('q');
var path    = require('path');

function sqlwrapper(){
    var
        self = this;

        self.CONFIG =  JSON.parse(fs.readFileSync(path.join(__dirname+'/config.json')));

        self.sqlConfigData = self.CONFIG[process.env.NODE_ENV || 'development'];
}

/* API to execute query */
sqlwrapper.prototype.execute = function (cb,query,params,database){
    var self=this;

    var conn = sql.createConnection({
        'host'      : self.sqlConfigData.HOST,
        'user'      : self.sqlConfigData.USER,
        'password'  : self.sqlConfigData.PASSWORD,
        'database'  : database || self.sqlConfigData.DATABASE
    });

    conn.connect(function(err) {
        if(err) {
            return cb(err);
            return;
        }

        console.log("Executing Query : ", query,params);

        conn.query(query, params, function(err,rows,fields) {
            if(err) {
                console.log("Error encountered..", err);
                return cb(err)
            }
            else {
                console.log("Query executed successfully");
                return cb(null,rows);
            }
        });
    });
}

module.exports=sqlwrapper;

/*

CREATE TABLE `eduserver`.`student_data` ( 
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , 
    `enrollment_no` VARCHAR(10) NOT NULL , 
    `name` VARCHAR(40) NOT NULL , 
    `due_amount` FLOAT NOT NULL DEFAULT '0' , 
    `dob` DATE NULL DEFAULT NULL , 
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    PRIMARY KEY (`id`),
    UNIQUE (`enrollment_no`)
  ) ENGINE = InnoDB;

  CREATE TABLE `eduserver`.`transaction_details` ( 
      `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , 
      `enrollment_no` VARCHAR(40) NOT NULL , 
      `txnid` VARCHAR(15) NOT NULL , 
      `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP , 
      `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
      `amount` FLOAT NOT NULL , 
      PRIMARY KEY (`id`), 
      UNIQUE (`txnid`)
) ENGINE = InnoDB;

*/