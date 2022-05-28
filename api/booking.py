from flask import Blueprint, request, make_response
from mysql.connector import pooling
from dotenv import load_dotenv
import os
import re
import jwt
import datetime

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
        
        response = {
            "ok": True
        }
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
