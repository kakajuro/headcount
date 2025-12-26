FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install -r requirements.txt

COPY *.py ./

# Sleep until cron job invokes a script
CMD ["sleep", "9999999999999d"]
