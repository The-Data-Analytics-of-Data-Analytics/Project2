from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/leaflet")
def leaflet():
    return render_template("leaflet.html")

if __name__ == "__main__":
    app.run(debug=True)