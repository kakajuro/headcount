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

# API call
response = requests.get(f"{api_url}/counts/recent?limit=2").json()
print(response)


# Email setup
subject = f'Extension Update: {datetime.datetime.now().strftime("%x")}'
sender = os.environ.get("EMAIL_2")
recipients = [os.environ.get("EMAIL_2")]
password = os.environ.get("EMAIL_PASSWORD_2")
body = "This is a test email!!"



# with yagmail.SMTP({sender: "Hello"}, password) as yag:
#   yag.send(to = {sender: sender}, subject=subject, contents=body)
# print("Sent!")

