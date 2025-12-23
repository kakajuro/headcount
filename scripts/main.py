from dotenv import load_dotenv
import os
import datetime
import yagmail

load_dotenv()

subject = f'Extension Update: {datetime.datetime.now().strftime("%x")}'
body = "This is a test email!!"
sender = os.environ.get("EMAIL_2")
recipients = [os.environ.get("EMAIL_2")]
password = os.environ.get("EMAIL_PASSWORD_2")


with yagmail.SMTP({sender: "Hello"}, password) as yag:
  yag.send(to = {sender: sender}, subject=subject, contents=body)
print("Sent!")

