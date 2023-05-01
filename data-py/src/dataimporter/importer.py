import asyncio
from functools import partial
import json
import time
import types
import logging

import typer
from dataimporter.message_handler import handle_message
from fastf1.utils import to_datetime
from influxdb_client import InfluxDBClient
from influxdb_client.client.write_api import SYNCHRONOUS
from fastf1.livetiming.client import SignalRClient

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

token = "LoOFvHw1tUXrUZ8oUqaozmEjxxG9UNO5H5YfRI4cGu306xwQVu_KMNxRYRMrWbhdD886N2PuRgpo9v4v_58pHw=="
org = "f1"
bucket = "data"

app = typer.Typer()


def fix_json(line):
    # fix F1's not json compliant data
    line = line.replace("'", '"') \
        .replace('True', 'true') \
        .replace('False', 'false')
    return line


def _to_file_overwrite(write_api, self, msg):
    msg = fix_json(msg)
    try:
        cat, msg, dt = json.loads(msg)
    except (json.JSONDecodeError, ValueError):
        log.warning("Json parse error")
        return

    # convert string to datetime
    try:
        dt = to_datetime(dt)
    except (ValueError, TypeError):
        log.warning("Datetime parse error {}", dt)
        return

    points = handle_message(cat, msg, dt)
    for point in points:
        write_api.write(bucket, org, point)


def _start_overwrite(self):
    """Connect to the data stream and start writing the data."""
    try:
        asyncio.run(self._async_start())
    except KeyboardInterrupt:
        self.logger.warning("Keyboard interrupt - exiting...")
        raise KeyboardInterrupt


def store_live_data(write_api):
    """
    Stores live data in a influx database
    This function only works if a f1 live session is active.
    """
    try:
        while True:
            client = SignalRClient("unused.txt")
            client.topics = ["Heartbeat", "WeatherData", "RaceControlMessages", "TimingData"]
            overwrite = partial(_to_file_overwrite, write_api)
            client._to_file = types.MethodType(overwrite,
                                               client)  # Override _to_file methode from fastf1 so the data will be stored in db rather then in a file
            client.start = types.MethodType(_start_overwrite, client)
            client.start()
    except KeyboardInterrupt:
        print('interrupted!')


@app.command()
def process_live_session(influx_url="http://localhost:8086"):
    with InfluxDBClient(url=influx_url, token=token, org=org) as client:
        write_api = client.write_api(write_options=SYNCHRONOUS)
        store_live_data(write_api)
    return 0


def main():
    app()


if __name__ == '__main__':
    main()
