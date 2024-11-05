CREATE TABLE tbl_member (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id VARCHAR(50) NOT NULL,
  pwd VARCHAR(120) NOT NULL,
  name VARCHAR(50) NOT NULL,
  reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE tbl_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  note VARCHAR(300) NOT NULL,
  del_yn VARCHAR(1) NOT NULL,
  category VARCHAR(10) NOT NULL,
  reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES tbl_member(id)
);

CREATE TABLE tbl_counsel(
  id int auto_increment primary key,
  user_id int not null,
  phone_num varchar(30) not null,
  email varchar(30) not null,
  location int not null,
  budget varchar(10) not null,
  detail varchar(50) not null,
  agree varchar(1) not null,
  del_yn varchar(1) not null,
  reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES tbl_member(id)
);

CREATE TABLE tbl_answer(
  id int auto_increment primary key,
  user_id int not null,
  counsel_id int not null,
  detail varchar(1000) not null,
  reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES tbl_member(id),
  FOREIGN KEY (counsel_id) REFERENCES tbl_counsel(id)
);

CREATE TABLE tbl_file(
  id int auto_increment primary key,
  target_id int not null,
  origin_name varchar(200) not null,
  change_name varchar(200) not null,
  ext varchar(50) not null,
  url varchar(255) not null,
  del_yn varchar(1) not null,
  reg_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  mod_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);