from dotenv import load_dotenv
import os
import datetime
import requests
import yagmail

load_dotenv()

api_url = os.environ.get("PRODUCTION_API_URL") if int(os.environ.get("IS_PRODUCTION")) else "http://localhost:3000"
sender = os.environ.get("EMAIL")
password = os.environ.get("EMAIL_PASSWORD")

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
yag = yagmail.SMTP(user=sender, password=password, port=587, smtp_starttls=True, smtp_ssl=False, timeout=10)
yag.send(to=sender, subject=subject, contents=body)
print("Sent update to inbox!", flush=True)
