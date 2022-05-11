from flask import Flask, render_template
from api.attractions import attractions

# 建立application物件，可以設定靜態檔案的路徑處理
app = Flask(__name__)
app.config.from_object("config.DevelopmentConfig")
app.register_blueprint(attractions,  url_prefix="/api")
app.secret_key = "login"


# 建立路徑/對應的處理函式，為網站首頁
@app.route("/")
def index():
	return render_template("homepage.html")


# 建立路徑/對應的處理函式，為網站首頁
@app.route("/attraction/<attractionId>")
def attaction(attractionId):
	return render_template("attraction.html")


# 啟動網站伺服器，可透過port參數設定指定埠號
if __name__ == "__main__":
    app.run(host='0.0.0.0', port = 3000)
