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
	return "Hello"


# 啟動網站伺服器，可透過port參數設定指定埠號
if __name__ == "__main__":
    app.run(port = 3000)