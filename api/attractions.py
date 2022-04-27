from flask import Blueprint, request, jsonify
import mysql.connector
from dotenv import load_dotenv
import os

attractions = Blueprint("attractions", __name__, template_folder="templates")
load_dotenv()
MYSQL_DB_PASSWORD = os.getenv('MYSQL_DB_PASSWORD')


# -------------依照分頁輸出景點資料------------------
@attractions.route("/attractions", methods=["GET"])
def search_attractions_by_page():
    connection = mysql.connector.connect(
        host="localhost",
        port="3306",
        user="root",
        password=MYSQL_DB_PASSWORD,
        database="taipei_tourism"
    )
    cursor = connection.cursor()
    page = int(request.args.get("page"))

    # 抓取景點資料
    try:
        sql_attr = ("""select Attraction_ID, Name, Introduction, Address, Tell 
                    from attractions where Number between %s and %s""")
        Number = (page*12-11, page*12)
        cursor.execute(sql_attr, Number)
        attr_records = cursor.fetchall()

        # 為了後面抓取景點照片跟類別而做的list
        loc_id_list = []
        for id in range(len(attr_records)):
            loc_id_list.append(attr_records[id][0])

        # 抓取地區資料
        sql_attr = ("""select Distric from distric 
                    where Attraction_ID in (
                        select Attraction_ID from attractions
                        where Number between %s and %s
                    )""")
        cursor.execute(sql_attr, Number)
        Distric_records = cursor.fetchall()

        # 抓取經緯度資料
        sql_attr = ("""select Latitude, Longitude from lat_long 
                    where Attraction_ID in (
                        select Attraction_ID from attractions
                        where Number between %s and %s
                    )""")
        cursor.execute(sql_attr, Number)
        lat_long_records = cursor.fetchall()

        # 抓取景點照片(用上面的loc_id_list，將每個Attraction_ID的照片放進來變成字典)
        sql_img = ("""select Attraction_ID, Image from images 
                    where Attraction_ID in (
                        select Attraction_ID from attractions
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
        sql_cate = ("""select Attraction_ID, Category from category 
                        where Attraction_ID in (
                            select Attraction_ID from attractions
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

        return response, 200

    except:
        response = {
            "error": True,
            "message": "伺服器異常"
        }

        response = jsonify(response)
        return response, 500
    
    finally:
        cursor.close
        connection.close


# ---------------依照景點ID輸出景點資料----------------
@attractions.route("/attractions/<attractionID>", methods=["GET"])
def search_attractions_by_ID(attractionID):
    connection = mysql.connector.connect(
        host="localhost",
        port="3306",
        user="root",
        password=MYSQL_DB_PASSWORD,
        database="taipei_tourism"
    )
    cursor = connection.cursor()
    Number = (attractionID,)

    try:
        # 抓取景點資料
        sql_attr = ("""select Attraction_ID, Name, Introduction, Address, Tell 
                    from attractions where Attraction_ID = %s""")
        cursor.execute(sql_attr, Number)
        attr_records = cursor.fetchall()
        if attr_records == []:
            raise IndexError

        # 抓取地區資料
        sql_attr = ("""select Distric from distric 
                    where Attraction_ID = %s
                    """)
        cursor.execute(sql_attr, Number)
        Distric_records = cursor.fetchall()

        # 抓取經緯度資料
        sql_attr = ("""select Latitude, Longitude from lat_long 
                    where Attraction_ID = %s
                    """)
        cursor.execute(sql_attr, Number)
        lat_long_records = cursor.fetchall()

        # 抓取景點照片
        sql_img = ("""select Image from images 
                    where Attraction_ID = %s""")
        cursor.execute(sql_img, Number)
        imgs_records = cursor.fetchall()
        img_list = []
        for img in range(len(imgs_records)):
            img_list.append(imgs_records[img][0])

        # # 抓取景點類別
        sql_cate = ("""select Category from category 
                        where Attraction_ID = %s
                    """)
        cursor.execute(sql_cate, Number)
        category_records = cursor.fetchall()
        cate_list = []
        for cate in range(len(category_records)):
            cate_list.append(category_records[cate][0])

        # 處理單筆資料
        one_data = {
            "ID": attr_records[0][0],
            "Name": attr_records[0][1],
            "category": cate_list,
            "Introduction": attr_records[0][2].replace("\r\n\r\n", ""),
            "Distric": Distric_records[0][0],
            "Address": attr_records[0][3],
            "Latitude": lat_long_records[0][0],
            "Longitude": lat_long_records[0][1],
            "Tell": attr_records[0][4],
            "Image": img_list
        }

        response = {
            "Data": one_data
        }
        response = jsonify(response)

        return response, 200

    except IndexError:
        response = {
            "error": True,
            "message": "請輸入正確景點ID"
        }
        response = jsonify(response)

        return response, 400

    except:
        response = {
            "error": True,
            "message": "伺服器異常"
        }
        response = jsonify(response)
        return "Server shut down", 500

    finally:
        cursor.close
        connection.close
