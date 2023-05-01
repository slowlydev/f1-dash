FROM python:3.9
ENV TZ=Europe/Berlin

RUN mkdir /app
WORKDIR /app

COPY setup.cfg /app/setup.cfg
COPY pyproject.toml /app/pyproject.toml
COPY src/ /app/src
RUN pip install .

