FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir pipenv && \
    pipenv install --system --deploy --clear

COPY *.py ./
COPY .env ./

# Sleep until cron job invokes a script
CMD ["sleep", "infinty"]
