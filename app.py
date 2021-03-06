from flask import Flask, render_template
from api.attractions import attractions
from api.members import members
from api.booking import booking
from api.order import order

app = Flask(__name__)
app.config.from_object("config.DevelopmentConfig")
app.register_blueprint(attractions, url_prefix="/api")
app.register_blueprint(members, url_prefix="/api")
app.register_blueprint(booking, url_prefix="/api")
app.register_blueprint(order, url_prefix="/api")


@app.route("/")
def index():
	return render_template("homepage.html")


@app.route("/attraction/<attractionId>")
def attaction(attractionId):
	return render_template("attraction.html")


@app.route("/booking")
def booking():
	return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


@app.route("/memberonly")
def memberonly():
	return render_template("member_only.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port = 3000)
