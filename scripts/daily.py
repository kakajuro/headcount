from dotenv import load_dotenv
import os
import requests
import scraper

load_dotenv()

api_url = ""

if int(os.environ.get("IS_PRODUCTION")) == 0:
  api_url = "http://localhost:3000"
else:
  api_url = os.environ.get("PRODUCTION_API_URL")

raoLinks = {
  "shortname": "rao",
  "chrome": "https://chromewebstore.google.com/detail/remove-ai-overview/jgiidhkmeobhfhigobkojechgmodclji?authuser=0&hl=en",
  "firefox": "https://addons.mozilla.org/en-US/firefox/addon/removeaioverviews/",
  "edge": "https://microsoftedge.microsoft.com/addons/detail/remove-ai-overview/ahhakmjljdfieadnnainepkoneamnabl"
}
tidytubeLinks = {
  "shortname": "tt",
  "chrome": "https://chromewebstore.google.com/detail/tidytube-declutter-youtub/apibkmhaeddgpadajegdpcdlifodaonb?authuser=0&hl=en",
  "firefox": "https://addons.mozilla.org/en-US/firefox/addon/tidytube-declutter-youtube/",
  "edge": "https://microsoftedge.microsoft.com/addons/detail/tidytube-declutter-yout/ofonionbpflcmjgnofibdegeaiibdflp"
}

apps = [raoLinks, tidytubeLinks]

for app in apps:

  print(f"Working on app: {app["shortname"]}")

  chromeUsers = scraper.getChromeUsers(app["chrome"])
  firefoxUsers = scraper.getFirefoxUsers(app["firefox"])
  edgeUsers = scraper.getEdgeUsers(app["edge"])

  print(f"Gathered all userdata for: {app["shortname"]}")
  print("Sending data to server...")

  data = {
    "shortname": app["shortname"],
    "usercountChrome": chromeUsers,
    "usercountFirefox": firefoxUsers,
    "usercountEdge": edgeUsers
  }

  try:
    response = requests.post(
      f"{api_url}/counts/add",
      headers={
          "Content-Type": "application/json",
      },
      json=data
    )

    print(f"Data sent to server sucessfully for: {app["shortname"]}")
  except Exception as e:
    print(f"An error occurred sending data to the server: {e}")
