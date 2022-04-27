from flask import Blueprint, request, Flask, redirect, render_template, session, jsonify
import mysql.connector
import json
from dotenv import load_dotenv
import os

attractions = Blueprint("attractions", __name__, template_folder="templates")
load_dotenv()
MYSQL_DB_PASSWORD = os.getenv('MYSQL_DB_PASSWORD')


# -------------依照分頁輸出景點資料------------------
@attractions.route("/attractions", methods = ["GET"])
def search_attractions_by_page():
    connection = mysql.connector.connect(
            host = "localhost",
            port = "3306",
            user = "root",
            password = MYSQL_DB_PASSWORD,
            database = "taipei_tourism"
        )
    cursor = connection.cursor()

    page = 30
    # 抓取景點資料
    sql_attr = ("""select Location_ID, Name, Introduction, Address, Tell 
                from attractions where Number between %s and %s""")
    Number = (page*12+1, page*12+12)
    cursor.execute(sql_attr, Number)
    attr_records = cursor.fetchall()

    # 為了後面抓取景點照片跟類別而做的list
    loc_id_list = []
    for id in range(len(attr_records)):
        loc_id_list.append(attr_records[id][0])

    
    # 抓取地區資料
    sql_attr = ("""select Distric from distric 
                where Location_ID in (
                    select Location_ID from attractions
                    where Number between %s and %s
                )""")
    cursor.execute(sql_attr, Number)
    Distric_records = cursor.fetchall()

    # 抓取經緯度資料
    sql_attr = ("""select Latitude, Longitude from lat_long 
                where Location_ID in (
                    select Location_ID from attractions
                    where Number between %s and %s
                )""")
    cursor.execute(sql_attr, Number)
    lat_long_records = cursor.fetchall()

    # 抓取景點照片(用上面的loc_id_list，將每個Location_ID的照片放進來變成字典)
    sql_img = ("""select Location_ID, Image from images 
                where Location_ID in (
                    select Location_ID from attractions
                    where Number between %s and %s
                )""")

    cursor.execute(sql_img, Number)
    imgs_records = cursor.fetchall()

    imgs_dict = {}
    for img_id in loc_id_list:
        img_list = []
        for img in range(len(imgs_records)):
            if imgs_records[img][0] == img_id:
                img_list.append(imgs_records[img][1])
            one_dict = {str(img_id): img_list}
        imgs_dict.update(one_dict)

    # # 抓取景點類別
    sql_cate = ("""select Location_ID, Category from category 
                    where Location_ID in (
                        select Location_ID from attractions
                        where Number between %s and %s
                )""")

    cursor.execute(sql_cate, Number)
    category_records = cursor.fetchall()

    categories_dict = {}
    for cat_id in loc_id_list:
        cate_list = []
        for cate in range(len(category_records)):
            if category_records[cate][0] == cat_id:
                cate_list.append(category_records[cate][1])
            one_dict = {str(cat_id): cate_list}
        categories_dict.update(one_dict)


    # 處理分頁資料
    page_datas = []
    for i in range(len(attr_records)):
        one_data = {
            "ID": attr_records[i][0],
            "Name": attr_records[i][1],
            "category": categories_dict[str(attr_records[i][0])],
            "Introduction": attr_records[i][2].replace("\r\n\r\n", ""),
            "Distric": Distric_records[i][0],
            "Address": attr_records[i][3],
            "Latitude": lat_long_records[i][0],
            "Longitude": lat_long_records[i][1],
            "Tell": attr_records[i][4],
            "Image": imgs_dict[str(attr_records[i][0])]
        }
        page_datas.append(one_data)

    response = {
            "ThisPage": page,
            "Data": page_datas
        }

    response = jsonify(response)
    cursor.close
    connection.close

    return response


# # ---------------依照景點ID輸出景點資料----------------
# @attractions.route("/attractions/<attractionID>", methods = ["GET"])
# def search_attractions_by_ID(attractionID):
#     connection = mysql.connector.connect(
#             host = "localhost",
#             port = "3306",
#             user = "root",
#             password = MYSQL_DB_PASSWORD,
#             database = "taipei_tourism"
#         )
#     cursor = connection.cursor()

#     # 抓取景點資料
#     sql_attr = ("""select Location_ID, Name, Introduction, Address, Tell 
#                 from attractions where Location_ID = %s""")
#     Number = (attractionID,)
#     cursor.execute(sql_attr, Number)
#     attr_records = cursor.fetchall()
#     print()

    
#     # 抓取地區資料
#     sql_attr = ("""select Distric from distric 
#                 where Location_ID in (
#                     select Location_ID from attractions
#                     where Location_ID = %s
#                 )""")
#     cursor.execute(sql_attr, Number)
#     Distric_records = cursor.fetchall()

#     # 抓取經緯度資料
#     sql_attr = ("""select Latitude, Longitude from lat_long 
#                 where Location_ID in (
#                     select Location_ID from attractions
#                     where Number between %s and %s
#                 )""")
#     cursor.execute(sql_attr, Number)
#     lat_long_records = cursor.fetchall()

#     # 抓取景點照片(用上面的loc_id_list，將每個Location_ID的照片放進來變成字典)
#     sql_img = ("""select Location_ID, Image from images 
#                 where Location_ID in (
#                     select Location_ID from attractions
#                     where Number between %s and %s
#                 )""")

#     cursor.execute(sql_img, Number)
#     imgs_records = cursor.fetchall()

#     imgs_dict = {}
#     for img_id in loc_id_list:
#         img_list = []
#         for img in range(len(imgs_records)):
#             if imgs_records[img][0] == img_id:
#                 img_list.append(imgs_records[img][1])
#             one_dict = {str(img_id): img_list}
#         imgs_dict.update(one_dict)

#     # # 抓取景點類別
#     sql_cate = ("""select Location_ID, Category from category 
#                     where Location_ID in (
#                         select Location_ID from attractions
#                         where Number between %s and %s
#                 )""")

#     cursor.execute(sql_cate, Number)
#     category_records = cursor.fetchall()

#     categories_dict = {}
#     for cat_id in loc_id_list:
#         cate_list = []
#         for cate in range(len(category_records)):
#             if category_records[cate][0] == cat_id:
#                 cate_list.append(category_records[cate][1])
#             one_dict = {str(cat_id): cate_list}
#         categories_dict.update(one_dict)


#     # 處理分頁資料
#     page_datas = []
#     for i in range(len(attr_records)):
#         one_data = {
#             "ID": attr_records[i][0],
#             "Name": attr_records[i][1],
#             "category": categories_dict[str(attr_records[i][0])],
#             "Introduction": attr_records[i][2].replace("\r\n\r\n", ""),
#             "Distric": Distric_records[i][0],
#             "Address": attr_records[i][3],
#             "Latitude": lat_long_records[i][0],
#             "Longitude": lat_long_records[i][1],
#             "Tell": attr_records[i][4],
#             "Image": imgs_dict[str(attr_records[i][0])]
#         }
#         page_datas.append(one_data)

#     response = {
#             "ThisPage": page,
#             "Data": page_datas
#         }

#     response = jsonify(response)
#     cursor.close
#     connection.close

#     return response