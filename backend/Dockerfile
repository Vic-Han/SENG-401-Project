FROM python:3.8.5

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

COPY requirements.txt ./

RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . ./

EXPOSE 8000
