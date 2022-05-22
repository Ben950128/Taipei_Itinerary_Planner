import imp
from flask import Blueprint, request
from mysql.connector import pooling
from dotenv import load_dotenv
import os
import re
import jwt

members = Blueprint("members", __name__, template_folder="templates")
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

@members.route("/members", methods = ["POST"])
def signup():
    connection_object1 = connection_pool.get_connection()
    cursor = connection_object1.cursor()
    request_json = request.get_json()
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    name = request_json["name"]
    username = request_json["username"]
    password = request_json["password"]
    email = request_json["email"]
    sql = ("select username from member where Username = %s")
    val = (username,)
    cursor.execute(sql, val)
    records_username = cursor.fetchall()
    sql = ("select username from member where Email = %s")
    val = (email,)
    cursor.execute(sql, val)
    records_email = cursor.fetchall()

    try:
        if name == "" or username == "" or password == "" or email == "":
            response = {
                "error": True,
                "message": "各欄位不可空白"
            }
            return response, 400

        elif (re.fullmatch(regex, email) == None):
            response = {
                "error": True,
                "message": "Email格式錯誤"
            }
            return response, 400

        elif records_username == [] and records_email == []:
            sql = "insert into member(Name, Username, Password, Email) values(%s, %s, %s, %s)"
            val = (name, username, password, email)
            cursor.execute(sql, val)
            response = {
                "ok": True
            }
            connection_object1.commit()
            return response, 200

        elif records_username != [] and records_email != []:
            response = {
                "error": True,
                "message": "該帳號及Email已被註冊"
            }
            return response, 400
            
        elif records_username == [] and records_email != []:
            response = {
                "error": True,
                "message": "該Email已被註冊"
            }
            return response, 400

        elif records_username != [] and records_email == []:
            response = {
                "error": True,
                "message": "該帳號已被註冊"
            }
            return response, 400

    except:
        response = {
            "error": True,
            "message": "伺服器錯誤"
        }
        return response, 500

    finally:
        cursor.close()
        connection_object1.close()
