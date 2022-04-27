create database taipei_tourism;
  
# 創建attractions基本表格
CREATE TABLE  `attractions` (
  `Location_ID` INT NOT NULL COMMENT 'Attraction_ID' PRIMARY KEY,
  `Number` INT NOT NULL AUTO_INCREMENT COMMENT 'Number' UNIQUE,
  `Name` VARCHAR(45) NOT NULL COMMENT 'Attraction_Name',
  `Introduction` TEXT COMMENT 'Attraction_Introduction',
  `Address` TEXT COMMENT 'Attraction_Address',
  `Tell` VARCHAR(50) COMMENT 'Attraction_Tellphone');
describe attractions;
select * from attractions;
select count(*) from attractions;

select Location_ID, Name, Introduction, Address, Tell 
from attractions
where Number between 361 and 372;


# 創建attractions_Distric表格
CREATE TABLE  `distric` (
  `Distric_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Image_ID' PRIMARY KEY,
  `Distric` VARCHAR(10) COMMENT 'Attraction_Distric',
  `Location_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Location_ID`)  REFERENCES `attractions`(`Location_ID`) ON DELETE CASCADE);
describe distric;
select * from distric;
select count(*) from distric;

select * from distric 
where Location_ID in (
	select Location_ID from attractions
    where Number between 1 and 12
);


# 創建attractions經緯度表格
CREATE TABLE  `lat_long` (
  `Lat_Long_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Image_ID' PRIMARY KEY,
  `Latitude` DOUBLE COMMENT 'Attraction_Latitude',
  `Longitude` DOUBLE COMMENT 'Attraction_Longitude',
  `Location_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Location_ID`)  REFERENCES `attractions`(`Location_ID`) ON DELETE CASCADE);
describe lat_long;
select * from lat_long;
select count(*) from lat_long;

select * from lat_long 
where Location_ID in (
	select Location_ID from attractions
    where Number between 1 and 12
);


# 創建img表格
CREATE TABLE  `images` (
  `Image_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Image_ID' PRIMARY KEY,
  `Name` VARCHAR(45) NOT NULL COMMENT 'Attraction_Name',
  `Image` TEXT NOT NULL COMMENT 'Attraction_Image',
  `Location_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Location_ID`)  REFERENCES `attractions`(`Location_ID`) ON DELETE CASCADE);
describe images;
select * from images;
select count(*) from images;

select * from images 
where Location_ID in (
	select Location_ID from attractions
    where Number = 1
);

# 創建category表格
CREATE TABLE  `category` (
  `Category_ID` INT NOT NULL AUTO_INCREMENT COMMENT 'Category_ID' PRIMARY KEY,
  `Name` VARCHAR(45) NOT NULL COMMENT 'Attraction_Name',
  `Category` TEXT NOT NULL COMMENT 'Attraction_Image',
  `Location_ID` INT NOT NULL COMMENT 'Attraction_ID',
  FOREIGN KEY(`Location_ID`)  REFERENCES `attractions`(`Location_ID`) ON DELETE CASCADE);
describe category;
select * from category;
select count(*) from category;
