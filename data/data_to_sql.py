import mysql.connector
import json
from dotenv import load_dotenv
import os

load_dotenv()
MYSQL_DB_PASSWORD = os.getenv('MYSQL_DB_PASSWORD')

connection = mysql.connector.connect(
		host = "localhost",
		port = "3306",
		user = "root",
		password = MYSQL_DB_PASSWORD,
		database = "taipei_tourism"
	)
cursor = connection.cursor()

with open("all_data.json", mode="r", encoding="utf-8") as file:
    data = json.load(file)

# 尋找不是新北市且含有img的data，也就是篩除沒有img的data
data_with_img = []
for i in range(len(data["data"])):
    if data["data"][i]["images"] != [] and data["data"][i]["address"][4:7] != "新北市":
        data_with_img.append(data["data"][i])
    else:
        continue


# 插入景點資料進mysql
# for i in range(len(data_with_img)):
# 	id = data_with_img[i]["id"]
# 	name = data_with_img[i]["name"]
# 	introduction = data_with_img[i]["introduction"]
# 	address = data_with_img[i]["address"]
# 	tell = data_with_img[i]["tel"]

# 	sql = "insert into attractions(Attraction_ID, Name, Introduction, Address, Tell) values(%s, %s, %s, %s, %s)"
# 	val = (id, name, introduction, address, tell)
# 	cursor.execute(sql,val)
# 	print("success")


# 插入地區資料進mysql
# for i in range(len(data_with_img)):
# 	distric = data_with_img[i]["distric"]
# 	id = data_with_img[i]["id"]

# 	sql = "insert into distric(Distric, Attraction_ID) values(%s, %s)"
# 	val = (distric, id)
# 	cursor.execute(sql,val)
# 	print("success")


# 插入經緯度資料進mysql
# for i in range(len(data_with_img)):
# 	lat = data_with_img[i]["nlat"]
# 	long = data_with_img[i]["elong"]
# 	id = data_with_img[i]["id"]

# 	sql = "insert into lat_long(Latitude, Longitude, Attraction_ID) values(%s, %s, %s)"
# 	val = (lat, long, id)
# 	cursor.execute(sql,val)
# 	print("success")


# 插入照片資料進mysql
# for j in range(len(data_with_img)):
# 	id = data_with_img[j]["id"]
# 	name = data_with_img[j]["name"]
# 	print(id, "\t", name)
# 	for k in range(len(data_with_img[j]["images"])):
# 		img = data_with_img[j]["images"][k]["src"]
# 		sql = "insert into images(Name, Image, Attraction_ID) values(%s, %s, %s)"
# 		val = (name, img, id)
# 		cursor.execute(sql,val)
# 		print(img)


# 插入分類資料進mysql
# for n in range(len(data_with_img)):
# 	id = data_with_img[n]["id"]
# 	name = data_with_img[n]["name"]
# 	print(id, "\t", name)
# 	for m in range(len(data_with_img[n]["category"])):
# 		cate = data_with_img[n]["category"][m]["name"]
# 		sql = "insert into category(Name, Category, Attraction_ID) values(%s, %s, %s)"
# 		val = (name, cate, id)
# 		cursor.execute(sql,val)
# 		print(cate)


cursor.close
connection.commit()
connection.close