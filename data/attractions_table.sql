create database taipei_tourism;
show databases;
# 創建attractions基本表格---------------------------------------------------------------------------------
CREATE TABLE  `attractions` (
  `Attraction_ID` INT NOT NULL COMMENT 'Attraction_ID' PRIMARY KEY,
  `Number` INT NOT NULL AUTO_INCREMENT COMMENT 'Number' UNIQUE,
  `Name` VARCHAR(45) NOT NULL COMMENT 'Attraction_Name',
  `Introduction` TEXT COMMENT 'Attraction_Introduction',
  `Address` TEXT COMMENT 'Attraction_Address',
  `Tell` VARCHAR(50) COMMENT 'Attraction_Tellphone');
describe attractions;
select * from attractions;
select count(*) from attractions;

select Attraction_ID, Name, Introduction, Address, Tell 
from attractions
where Attraction_ID in (
	select Attraction_ID from distric where distric = "大同區"
) order by Attraction_ID limit 0,12 ;

select Attraction_ID, Name, Introduction, Address, Tell 
from attractions where Number between 1 and 12 order by Attraction_ID;

select Attraction_ID, Name, Introduction, Address, Tell 
from attractions where Name LIKE '%台北%' order by Attraction_ID limit 0, 12;

# 創建attractions_Distric表格---------------------------------------------------------------------------------
CREATE TABLE  `distric` (
  `Distric_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Image_ID' PRIMARY KEY,
  `Distric` VARCHAR(10) COMMENT 'Attraction_Distric',
  `Attraction_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Attraction_ID`)  REFERENCES `attractions`(`Attraction_ID`) ON DELETE CASCADE);
describe distric;
select * from distric;
select count(*) from distric group by distric;

select * from distric where Attraction_ID in (
		select Attraction_ID from attractions
		where Name LIKE '%廟%') order by Attraction_ID;

select *from distric 
where Attraction_ID = 2576;


# 創建attractions經緯度表格---------------------------------------------------------------------------------
CREATE TABLE  `lat_long` (
  `Lat_Long_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Image_ID' PRIMARY KEY,
  `Latitude` DOUBLE COMMENT 'Attraction_Latitude',
  `Longitude` DOUBLE COMMENT 'Attraction_Longitude',
  `Attraction_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Attraction_ID`)  REFERENCES `attractions`(`Attraction_ID`) ON DELETE CASCADE);
describe lat_long;
select * from lat_long;
select count(*) from lat_long;

select * from lat_long 
where Attraction_ID in (
	select Attraction_ID from attractions
    where Number between 1 and 12
);


# 創建img表格-------------------------------------------------------------------------------------------
CREATE TABLE  `images` (
  `Image_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Image_ID' PRIMARY KEY,
  `Image` TEXT NOT NULL COMMENT 'Attraction_Image',
  `Attraction_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Attraction_ID`)  REFERENCES `attractions`(`Attraction_ID`) ON DELETE CASCADE);
describe images;
select * from images;
select count(*) from images;

select * from images 
where Attraction_ID in (
	select Attraction_ID from attractions
    where Number = 1
);
select Attraction_ID, Image from images 
where Attraction_ID in (
select Attraction_ID from category where category = "單車遊蹤");


# 創建category表格------------------------------------------------------------------------------------------
CREATE TABLE  `category` (
  `Category_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Category_ID' PRIMARY KEY,
  `Category` TEXT NOT NULL COMMENT 'Attraction_Image',
  `Attraction_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Attraction_ID`)  REFERENCES `attractions`(`Attraction_ID`) ON DELETE CASCADE);
describe category;
select * from category;
select count(*) from category;
select * from category order by Category_ID desc limit 1;

select Attraction_ID, Category from category 
where Attraction_ID in (
select Attraction_ID from category where category = "單車遊蹤"
);

# 創建個人資料表格------------------------------------------------------------------------------------------
CREATE TABLE  `member` (
  `Member_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Member_ID' PRIMARY KEY,
  `Name` VARCHAR(45) NOT NULL COMMENT 'Name',
  `Username` VARCHAR(45) NOT NULL COMMENT 'Username',
  `Password` VARCHAR(45) NOT NULL COMMENT 'Password',
  `Email` VARCHAR(45) NOT NULL COMMENT 'Email',
  `Time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);

describe member;
select * from member;
drop table member;
select * from member where Username = "test" and Password = "test";


# 創建預定行程表格(未付款)------------------------------------------------------------------------------------------
CREATE TABLE  `booking` (
  `Booking_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Booking_ID' PRIMARY KEY,
  `Username` VARCHAR(45) NOT NULL COMMENT 'Username',
  `Email` VARCHAR(45) NOT NULL COMMENT 'Email',
  `Attraction_ID` INT NOT NULL COMMENT 'Attraction_ID',
  `Date` VARCHAR(45) NOT NULL COMMENT 'Date',
  `Cost` VARCHAR(45) NOT NULL COMMENT 'Cost');
  
select * from booking where Username = "test" and Attraction_ID = 2261 and Date = "2022-05-29";

select Attraction_ID, Name, Address, Tell from attractions where Attraction_ID in (select Attraction_ID from booking where Username = "test");
select Image from images where Attraction_ID in (select Attraction_ID from booking where Username = "test") limit 1;
delete from booking where Username = "test";
drop table booking;

# 創建預行程表格(已付款)------------------------------------------------------------------------------------------
CREATE TABLE  `order_tappay` (
  `Order_ID` VARCHAR(20) NOT NULL COMMENT 'Order_ID' PRIMARY KEY,
  `Username` VARCHAR(45) NOT NULL COMMENT 'Username',
  `Email` VARCHAR(45) NOT NULL COMMENT 'Email',
  `Contact_Phone` VARCHAR(45) NOT NULL COMMENT 'User_Phone',
  `Attraction_ID` INT NOT NULL COMMENT 'Attraction_ID',
  `Date` VARCHAR(45) NOT NULL COMMENT 'Date',
  `Cost` VARCHAR(45) NOT NULL COMMENT 'Cost',
  `Time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);

select * from order_tappay;
select * from order_tappay o 
join attractions a on o.Attraction_ID = a.Attraction_ID where Username = "test"
order by o.Order_ID desc;

drop table order_tappay;