from flask import Blueprint, request, make_response
from mysql.connector import pooling
from dotenv import load_dotenv
import os
import jwt

booking = Blueprint("booking", __name__, template_folder="templates")
load_dotenv()
MYSQL_DB_PASSWORD = os.getenv('MYSQL_DB_PASSWORD')
SECRET_KEY = os.getenv('SECRET_KEY')

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mysql_pool",
    pool_size=5,
    pool_reset_session=True,
    host='localhost',
    database='taipei_tourism',
    user='root',
    password=MYSQL_DB_PASSWORD,
)

# 取得預定資訊
@booking.route("/booking", methods = ["GET"])
def get_booking():
    connection_object1 = connection_pool.get_connection()
    cursor = connection_object1.cursor()
    try: 
        Token = request.cookies.get('Token')
        decode_token = jwt.decode(Token, SECRET_KEY, algorithms="HS256")
        username = decode_token["username"]
        name = decode_token["name"]
        email = decode_token["email"]
        
        # 依照booking紀錄select景點資料
        select_attraction_sql = ("""select Attraction_ID, Name, Address, Tell from attractions 
                                    where Attraction_ID in 
                                    (select Attraction_ID from booking where Username = %s)""")
        select_attraction_val = (username,)
        cursor.execute(select_attraction_sql, select_attraction_val)
        records_attraction = cursor.fetchall()
        
        attraction_id = records_attraction[0][0]
        attraction_name = records_attraction[0][1]
        attraction_address = records_attraction[0][2]
        attraction_tell = records_attraction[0][3]

        # 依照booking紀錄select景點照片
        select_image_sql = ("""select Image from images 
                                where Attraction_ID in 
                                (select Attraction_ID from booking where Username = %s) limit 1""")
        select_image_val = (username,)
        cursor.execute(select_image_sql, select_image_val)
        records_image = cursor.fetchall()
        attraction_image = records_image[0][0]

        # select該帳號booking資訊
        select_booking_sql = ("select Date, Cost from booking where Username = %s")
        select_booking_val = (username,)
        cursor.execute(select_booking_sql, select_booking_val)
        records_booking = cursor.fetchall()
        booking_date = records_booking[0][0]
        booking_cost = records_booking[0][1]

        response = {
            "data": {
                "attraction_id": attraction_id,
                "attraction_name": attraction_name,
                "attraction_address": attraction_address,
                "attraction_tell": attraction_tell,
                "attraction_image": attraction_image
            },
            "name": name,
            "username": username,
            "email": email,
            "date": booking_date,
            "cost": booking_cost
        }

        return make_response(response, 200)

    except jwt.exceptions.ExpiredSignatureError:
        response = {
            "error": True,
            "message": "尚未登入系統"
        }
        return make_response(response, 403)

    except IndexError:
        response = {
            "error": True,
            "name": name,
            "message": "無任何待預定行程"
        }
        return make_response(response, 403)

    except:
        response = {
            "error": True,
            "message": "伺服器錯誤"
        }
        return make_response(response, 500)
    
    finally:
        cursor.close()
        connection_object1.close()


# 預定行程
@booking.route("/booking", methods = ["POST"])
def post_booking():
    connection_object2 = connection_pool.get_connection()
    cursor = connection_object2.cursor()
    try: 
        request_json = request.get_json()
        Token = request.cookies.get('Token')
        decode_token = jwt.decode(Token, SECRET_KEY, algorithms="HS256")
        username = decode_token["username"]
        email = decode_token["email"]
        attraction_id = request_json["Attraction_ID"]
        date = request_json["Date"]
        cost = request_json["Cost"]

        select_sql = ("select Attraction_ID, Date, Cost from booking where Username = %s")
        select_val = (username,)
        cursor.execute(select_sql, select_val)
        records_booking = cursor.fetchall()
        
        if records_booking != []:
            update_sql = ("update booking set Attraction_ID = %s, Date = %s, Cost = %s where Username = %s")
            update_val = (attraction_id, date, cost, username)
            cursor.execute(update_sql, update_val)

        else:
            insert_sql = "insert into booking(Username, Email, Attraction_ID, Date, Cost) values(%s, %s, %s, %s, %s)"
            insert_val = (username, email, attraction_id, date, cost)
            cursor.execute(insert_sql, insert_val)
            
        response = {
            "ok": True
        }
        connection_object2.commit()
        return make_response(response, 200)

    except (jwt.ExpiredSignatureError, jwt.exceptions.DecodeError):
        response = {
            "error": True,
            "message": "尚未登入系統"
        }
        return make_response(response, 403)

    except:
        response = {
            "error": True,
            "message": "伺服器錯誤"
        }
        return make_response(response, 500)

    finally:
        cursor.close()
        connection_object2.close()


# 刪除預定行程
@booking.route("/booking", methods = ["DELETE"])
def delete_booking():
    connection_object3 = connection_pool.get_connection()
    cursor = connection_object3.cursor()
    try: 
        Token = request.cookies.get('Token')
        decode_token = jwt.decode(Token, SECRET_KEY, algorithms="HS256")
        username = decode_token["username"]
        name = decode_token["name"]
        delete_sql = ("delete from booking where Username = %s ")
        delete_val = (username,)
        cursor.execute(delete_sql, delete_val)
        response = {
            "ok": True,
            "name": name
        }
        connection_object3.commit()
        return make_response(response, 200)

    except:
        response = {
            "error": True,
            "message": "尚未登入系統"
        }
        return make_response(response, 403)

    finally:
        cursor.close()
        connection_object3.close()