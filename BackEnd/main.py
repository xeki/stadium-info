import flask
from flask import Flask, request
from flask_cors import CORS
from htmlToList import *
app = Flask(__name__)
CORS(app)

@app.route("/")
def test():
	return "Positive"
@app.route("/search",methods=["GET","OPTIONS"])
def std_search():
	search_text = request.args.get("search_text")
	res = search_stadium(search_text.lower())
	return res
@app.route('/detail',methods=['GET','OPTIONS'])
def get_detials():
	std_url = request.args.get("url")
	details = get_stadium_details(std_url)
	return details
if __name__ == "__main__":
	app.run(host='0.0.0.0',port=8080)