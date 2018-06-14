from flask import Flask
from bs4 import BeautifulSoup
import requests 
import json

BASE_URL = "https://www.superpesis.fi/stadionit/"

def get_stadium_lists():
	r = requests.get(BASE_URL)
	html = BeautifulSoup(r.text,'html.parser')
	li =html.body.find("ul",attrs={"class":"split-list"})
	all_stad = li.find_all("li")
	data_list = []
	for s in all_stad:
		data_list.append(dict({"name":s.a.text.lower(),"href":s.a["href"]}))
	return data_list
	
def search_stadium(search_text):
	s_list = get_stadium_lists()
	res = []
	for s in s_list:
		if s["name"].startswith(search_text):
			res.append(s)
	return json.dumps(res,ensure_ascii=False)
	
def get_stadium_details(stadium_url):
	r = requests.get(BASE_URL+stadium_url.split("/")[2])
	result = dict()
	html = BeautifulSoup(r.text,'html.parser')
	divs = html.body.find("div",attrs={"class":"news-holder"})
	fields = ["Nimi","Osoite","Kapasitetti","Katettuja paikkoja","Palvelut","Kotistadion"]
	details = divs.dl
	titels = details.find_all("dt")
	data = details.find_all("dd")
	result["desc"]= divs.find_all("p")[0].text
	for i, t in enumerate(titels):
		if i<len(data):
			result[t.text]=data[i].text
		else:
			result[t.text]=""
	result["Temp"] = get_weather(result["Osoite"].split(" ")[-1])	
	return json.dumps(result,ensure_ascii=False)
	
def get_weather(address):
	try:
		r = requests.get("http://api.openweathermap.org/data/2.5/weather?q="+address+"&APPID=9d52bdcae38750ba99d2befd8dc42942&&units=metric")
		formatted_r = r.json()
		temp = formatted_r["main"]["temp"]
		#print(r.json(),temp)
		return temp
	except:
		return ""
	
	


#res = search_stadium("Skaala")
#res2 = get_stadium_details("/stadionit/skaala-areena/")
#print(res,res2)
#get_weather("Hyllykallio")