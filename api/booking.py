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
    auth_plugin='mysql_native_password'
)


@booking.route("/booking", methods = ["POST"])
def new_booking():
    connection_object1 = connection_pool.get_connection()
    cursor = connection_object1.cursor()
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
        connection_object1.commit()
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
        connection_object1.close()
