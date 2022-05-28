from flask import Blueprint, request, make_response
from mysql.connector import pooling
from dotenv import load_dotenv
import os
import re
import jwt
import datetime

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


@members.route("/members", methods = ["GET"])
def if_member_login():
    try:
        Token = request.cookies.get('Token')
        decode_token = jwt.decode(Token, SECRET_KEY, algorithms="HS256")
        response = {
            "data": {
                "member_id": decode_token["member_id"],
                "username": decode_token["username"],
                "email": decode_token["email"]
            }
        }
        return make_response(response, 200)

    except:
        response = {
            "data": None
        }
        return make_response(response, 200)


@members.route("/members", methods = ["POST"])
def signup():
    connection_object2 = connection_pool.get_connection()
    cursor = connection_object2.cursor()
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
            return make_response(response, 400)

        elif (re.fullmatch(regex, email) == None):
            response = {
                "error": True,
                "message": "Email格式錯誤"
            }
            return make_response(response, 400)

        elif records_username == [] and records_email == []:
            sql = "insert into member(Name, Username, Password, Email) values(%s, %s, %s, %s)"
            val = (name, username, password, email)
            cursor.execute(sql, val)
            response = {
                "ok": True
            }
            connection_object2.commit()
            return make_response(response, 200)

        elif records_username != [] and records_email != []:
            response = {
                "error": True,
                "message": "該帳號及Email已被註冊"
            }
            return make_response(response, 400)
            
        elif records_username == [] and records_email != []:
            response = {
                "error": True,
                "message": "該Email已被註冊"
            }
            return make_response(response, 400)

        elif records_username != [] and records_email == []:
            response = {
                "error": True,
                "message": "該帳號已被註冊"
            }
            return make_response(response, 400)

    except:
        response = {
            "error": True,
            "message": "伺服器錯誤"
        }
        return make_response(response, 500)

    finally:
        cursor.close()
        connection_object2.close()


@members.route("/members", methods = ["PATCH"])
def login():
    connection_object3 = connection_pool.get_connection()
    cursor = connection_object3.cursor()
    request_json = request.get_json()
    username = request_json["username"]
    password = request_json["password"]
    sql = ("select member_id, username, email from member where Username = %s and Password = %s")
    val = (username,password)
    cursor.execute(sql, val)
    records_username = cursor.fetchall()
    if records_username != []:
        member_id = records_username[0][0]
        email = records_username[0][2]
        response = {
            "ok": True
        }
        token = jwt.encode(
            {
                "member_id": member_id,
                "username": username,
                "email": email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=1)
            },
            SECRET_KEY, algorithm="HS256"
        )
        res = make_response(response, 200)
        res.set_cookie(key="Token", value=token)
        cursor.close()
        connection_object3.close()
        return res

    elif records_username == []:
        response = {
            "error": True,
            "message": "使用者尚未註冊"
        }
        res = make_response(response, 400)
        cursor.close()
        connection_object3.close()
        return res

    else:
        response = {
            "error": True,
            "message": "伺服器錯誤"
        }
        res = make_response(response, 500)
        cursor.close()
        connection_object3.close()
        return res