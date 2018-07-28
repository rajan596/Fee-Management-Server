


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