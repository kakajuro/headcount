from dotenv import load_dotenv
import requests
import os
import datetime
import yagmail

load_dotenv()

api_url = ""

if int(os.environ.get("IS_PRODUCTION")) == 0:
  api_url = "http://localhost:3000"
else:
  api_url = os.environ.get("PRODUCTION_API_URL")

# Email setup
subject = f'Extension Update: {datetime.datetime.now().strftime("%x")}'
sender = os.environ.get("EMAIL")
recipients = [os.environ.get("EMAIL")]
password = os.environ.get("EMAIL_PASSWORD")
body = f"""Extension usercounts for this week: \n"""

# API call
print("Fetching extension data")
response = requests.get(f"{api_url}/counts/weekly").json()

print("Formatting update email")
for app in response:
  totalUsers = app["usercountChrome"] + app["usercountFirefox"] + app["usercountEdge"]
  sign = ""
  daysCount = ""

  if app["userDifference"] >= 0:
    sign = "+"
  elif app["userDifference"] < 0:
    sign = "-"

  if app["dayDifference"] == 7:
    daysCount = "1 week ago"
  else:
    daysCount = f"{app["dayDifference"]} days ago"

  dataString = f"""
  {app["name"]} ({app["shortname"]}) has {totalUsers} users
  ({sign}{app["userDifference"]} from {daysCount})
  """

  body += dataString

print("Sending update email")

with yagmail.SMTP({sender: "Hello"}, password, port=587) as yag:
  yag.send(to = {sender: sender}, subject=subject, contents=body)

print("Sent update to inbox!")

