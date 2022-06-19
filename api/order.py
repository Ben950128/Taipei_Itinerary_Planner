from flask import Blueprint, request, make_response
from mysql.connector import pooling
from dotenv import load_dotenv
import os
import json
import requests
import re
import jwt
import datetime

order = Blueprint("order", __name__, template_folder="templates")
load_dotenv()
MYSQL_DB_HOST = os.getenv('MYSQL_DB_HOST')
MYSQL_DB_DATABASE = os.getenv('MYSQL_DB_DATABASE')
MYSQL_DB_USER = os.getenv('MYSQL_DB_USER')
MYSQL_DB_PASSWORD = os.getenv('MYSQL_DB_PASSWORD')
SECRET_KEY = os.getenv('SECRET_KEY')
PARTNER_KEY = os.getenv("PARTNER_KEY")
MERCHANT_ID = os.getenv("MERCHANT_ID")

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mysql_pool",
    pool_size=5,
    pool_reset_session=True,
    host=MYSQL_DB_HOST,
    database=MYSQL_DB_DATABASE,
    user=MYSQL_DB_USER,
    password=MYSQL_DB_PASSWORD,
)

# GET給已經付款的資料
@order.route("/order", methods = ["GET"])
def get_order():
    connection_object1 = connection_pool.get_connection()
    cursor = connection_object1.cursor()
    try: 
        Token = request.cookies.get('Token')
        decode_token = jwt.decode(Token, SECRET_KEY, algorithms="HS256")
        name = decode_token["name"]
        member_id = decode_token["member_id"]
        email = decode_token["email"]
        select_order_sql = ("""select O.Order_ID, O.Attraction_ID, A.Name, A.Address, A.Tell, O.Date, O.Cost, O.Contact_Phone from 
                            order_tappay O join attractions A on O.Attraction_ID = A.Attraction_ID
                            where Member_id = %s order by O.Order_ID desc""")
        select_order_val = (member_id,)
        cursor.execute(select_order_sql, select_order_val)
        records = cursor.fetchall()
        if records != []:
            response = {}
            for i in range(len(records)):
                select_image_sql = ("""select Image from images 
                                        where Attraction_ID = %s limit 1""")
                select_image_val = (records[i][1],)
                cursor.execute(select_image_sql, select_image_val)
                image = cursor.fetchall()

                response["data" + str(i)] = {}
                response["data" + str(i)]["order_id"] = records[i][0]
                response["data" + str(i)]["attraction_id"] = records[i][1]
                response["data" + str(i)]["attarction_name"] = records[i][2]
                response["data" + str(i)]["attarction_image"] = image[0][0]
                response["data" + str(i)]["attarction_address"] = records[i][3]
                response["data" + str(i)]["attarction_tell"] = records[i][4]
                response["data" + str(i)]["attarction_date"] = records[i][5]
                response["data" + str(i)]["attarction_cost"] = records[i][6]
                response["data" + str(i)]["name"] = name
                response["data" + str(i)]["email"] = email
                response["data" + str(i)]["contact_phone"] = records[i][7]

            return make_response(response, 200)
        else:
            response = {
                "error": True,
                "message": "尚無已預定行程"
            }
            return make_response(response, 200)

    except jwt.exceptions.ExpiredSignatureError:
        response = {
            "error": True,
            "message": "帳號尚未登入"
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

# POST給TAPPAY
@order.route("/order", methods = ["POST"])
def post_to_tappay():
    connection_object2 = connection_pool.get_connection()
    cursor = connection_object2.cursor()
    try: 
        Token = request.cookies.get('Token')
        decode_token = jwt.decode(Token, SECRET_KEY, algorithms="HS256")
        request_json = request.get_json()
        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        headers = {
            "Content-Type": "application/json",
            "x-api-key": PARTNER_KEY
        }
        prime = request_json["prime"]
        cost = request_json["order"]["price"]
        phone_number = request_json["order"]["contact"]["phone"]
        member_name = request_json["order"]["contact"]["name"]
        email = request_json["order"]["contact"]["email"]
        date = request_json["order"]["trip"]["date"]
        attraction_id = request_json["order"]["trip"]["attraction"]["id"]
        member_id = decode_token["member_id"]
        datetime_now = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        order_id = datetime_now + str(member_id)
        datas = {
            "prime": prime,
            "partner_key": PARTNER_KEY,
            "merchant_id": MERCHANT_ID,
            "details": "taipei trip",
            "order_number": order_id,
            "amount": cost,
            "cardholder": {
                "phone_number": phone_number,
                "name": member_name,
                "email": email
            }
        }
        # 發requests給tappay
        tappay_response = requests.post(url, headers=headers, data=json.dumps(datas))
        tappay_response_dict = json.loads(tappay_response.text)
        
        if tappay_response_dict["status"] == 0:
            insert_sql = """insert into order_tappay(Order_ID, Member_id, Contact_Phone, Attraction_ID, Date, Cost) 
                            values(%s, %s, %s, %s, %s, %s)"""
            insert_val = (order_id, member_id, phone_number, attraction_id, date, cost)
            cursor.execute(insert_sql, insert_val)
            response = {
                "order_number": order_id,
                "message": "付款成功"
            }
            connection_object2.commit()
            return make_response(response, 200)

        else:
            response = {
                "error": True,
                "message": "付款失敗"
            }
            return make_response(response, 200)

    except jwt.exceptions.ExpiredSignatureError:
        response = {
            "error": True,
            "message": "帳號尚未登入"
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
