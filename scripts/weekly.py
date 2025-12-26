from dotenv import load_dotenv
import os
import datetime
import requests
from mailjet_rest import Client

load_dotenv()

api_url = os.environ.get("PRODUCTION_API_URL") if int(os.environ.get("IS_PRODUCTION")) else "http://localhost:3000"
sender = os.environ.get("EMAIL")
password = os.environ.get("EMAIL_PASSWORD")

MJ_PUBLIC=os.environ.get("MJ_PUBLIC")
MJ_PRIVATE=os.environ.get("MJ_PRIVATE")
EMAIL=os.environ.get("EMAIL")
mailjet = Client(auth=(MJ_PUBLIC, MJ_PRIVATE), version="v3.1")

subject = f'Extension Update: {datetime.datetime.now().strftime("%x")}'
body = "Extension usercounts for this week:\n"

print("Fetching extension data", flush=True)
response = requests.get(f"{api_url}/counts/weekly", timeout=10)
response.raise_for_status()
data = response.json()

print("Formatting update email", flush=True)
for app in data:
    totalUsers = app["usercountChrome"] + app["usercountFirefox"] + app["usercountEdge"]
    sign = "+" if app["userDifference"] >= 0 else "-"
    daysCount = "1 week ago" if app["dayDifference"] == 7 else f"{app['dayDifference']} days ago"

    body += f"{app['name']} ({app['shortname']}) has {totalUsers} users ({sign}{app['userDifference']} from {daysCount})\n"

print("Sending update email", flush=True)

data = {
    'Messages': [
        {
            "From": {"Email": EMAIL, "Name": "Extension Update"},
            "To": [{"Email": EMAIL, "Name": "Recipient"}],
            "Subject": subject,
            "TextPart": body
        }
    ]
}

result = mailjet.send.create(data=data)

if result.status_code == 200:
    print("Sent update to inbox!", flush=True)


