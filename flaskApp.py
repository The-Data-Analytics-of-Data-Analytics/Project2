from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

def init():
    #initial page loading data

init()

@app.route("/")
def home():
    #render D3 data
    return render_template("index.html")

@app.route("/leaflet")
def leaflet():
    #render leaflet data

if __name__ == "__main__":
    app.run(debug=True)