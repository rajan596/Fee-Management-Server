<a href='https://coveralls.io/github/rajan596/Fee-Management-Server?branch=master'><img src='https://coveralls.io/repos/github/rajan596/Fee-Management-Server/badge.svg?branch=master' alt='Coverage Status' /></a>


# Fee-Management-Server
Server to manage fee/utility payment


# Architecture

1. Express framework for NodeJS
2. Database - MySQL
3. RESTful APIs

# DB Schema

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

#APIs

Validation:-

Error codes:
  100 : success
  101 : Invalid Req Type
  102 : Invalid Enrollment No

Recharge:-

Error codes:
  100 : success
  101 : Invalid Req Type
  102 : Invalid Enrollment No
  103 : Invalid Amount
  104 : Duplicate txn id
  105 : failed

Statuscheck:-
  100 : success
  104 : Invalid Txn ID
  105 : failed
