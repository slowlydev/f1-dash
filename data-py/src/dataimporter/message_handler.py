import logging
from influxdb_client import Point, WritePrecision

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)


D_LOOKUP = [[44, 'HAM', 'Mercedes', '#6CD3BF', 'SOLID'], [63, 'RUS', 'Mercedes', '#6CD3BF', 'DOT'],
            [55, 'SAI', 'Ferrari', '#F91536', 'DOT'], [16, 'LEC', 'Ferrari', '#F91536', 'SOLID'],
            [1, 'VER', 'Red Bull', '#3671C6', 'SOLID'], [11, 'PER', 'Red Bull', '#3671C6', 'DOT'],
            [81, 'PIA', 'McLaren', '#F58020', 'DOT'], [4, 'NOR', 'McLaren', '#F58020', 'SOLID'],
            [14, 'ALO', 'Aston Martin', '#358C75', 'SOLID'], [18, 'STR', 'Aston Martin', '#358C75', 'DOT'],
            [10, 'GAS', 'Alpine', '#2293D1', 'SOLID'], [31, 'OCO', 'Alpine', '#2293D1', 'DOT'],
            [22, 'TSU', 'AlphaTauri', '#5E8FAA', 'SOLID'], [21, 'DEV', 'AlphaTauri', '#5E8FAA', 'DOT'],
            [27, 'HUL', 'Haas F1 Team', '#B6BABD', 'SOLID'], [20, 'MAG', 'Haas F1 Team', '#B6BABD', 'DOT'],
            [24, 'ZHO', 'Alfa Romeo', '#C92D4B', 'DOT'], [77, 'BOT', 'Alfa Romeo', '#C92D4B', 'SOLID'],
            [2, 'SAR', 'Williams', '#37BEDD', 'DOT'], [23, 'ALB', 'Williams', '#37BEDD', 'SOLID']]


def driver_no_to_name(driver_no: str) -> str:
    for entry in D_LOOKUP:
        if str(entry[0]) == driver_no:
            return entry[1]
    log.warning("Driver not found %s", driver_no)
    return "UKN"


def get_LastLapTime_from_TimingData(message):
    # message example: {'Lines': {'77': {'Sectors': {'2': {'PreviousValue': '34.125'}}, 'LastLapTime': {'Value': '1:30.997', 'PersonalFastest': False}}}}
    results = []
    items = message["Lines"].items()
    for driverNo, value in items:
        if "LastLapTime" in value:
            if "Value" in value["LastLapTime"]:
                result = driverNo, lap_time_to_timespan(value["LastLapTime"]["Value"])
                results.append(result)
    return results


def get_GapToLeader_from_TimingData(message):
    # message example: {'Lines': {'11': {'GapToLeader': '+41.005', 'IntervalToPositionAhead': {'Value': '+28.876'}}}}
    results = []
    items = message["Lines"].items()
    for driverNo, value in items:
        if "GapToLeader" in value and value["GapToLeader"] != "":
            result = driverNo, value["GapToLeader"]
            results.append(result)
    return results


def get_NumberOfLaps_from_TimingData(message):
    # message example: {'Lines': {'10': {'NumberOfLaps': 7, 'Sectors': {'2': {'Value': '25.040'}}, 'Speeds': {'FL': {'Value': '285'}}, 'LastLapTime': {'Value': '1:41.134'}}}}
    results = []
    items = message["Lines"].items()
    for driverNo, value in items:
        if "NumberOfLaps" in value and value["NumberOfLaps"] != "":
            result = driverNo, value["NumberOfLaps"]
            results.append(result)
    return results


def get_IntervalToPositionAhead_from_TimingData(message):
    # message example: {'Lines': {'11': {'GapToLeader': '+41.005', 'IntervalToPositionAhead': {'Value': '+28.876'}}}}
    results = []
    items = message["Lines"].items()
    for driverNo, value in items:
        if "IntervalToPositionAhead" in value:
            if "Value" in value["IntervalToPositionAhead"] and value["IntervalToPositionAhead"]["Value"] != "":
                result = driverNo, interval_to_timespan(value["IntervalToPositionAhead"]["Value"])
                results.append(result)
    return results


def get_SpeedTrap_from_TimingData(message):
    # message example: {'Lines': {'55': {'Speeds': {'ST': {'Value': '294'}}}}}
    # ST = Speed Trap, I1 = Intermediate 1, Intermeditate 2, FL = Finish Line
    results = []
    items = message["Lines"].items()
    for driverNo, value in items:
        if "Speeds" in value:
            speed_values = list(value['Speeds'].items())
            for position, speed in speed_values:
                if position == 'ST' and 'Value' in speed and speed['Value'] != "":
                    results.append((driverNo, int(speed['Value'])))
    return results


def lap_time_to_timespan(time_string) -> float:
    m, remain = time_string.split(':')
    s, ms = remain.split(".")
    return int(m) * 60 + int(s) + int(ms) / 1000


def interval_to_timespan(time_string) -> float:
    if "LAP" in time_string:
        return 0.0
    if " L" in time_string:  # Lapped cars have "1 L", "2 L", ... gap to leader
        return 500.0  # TODO how to handle lapped cars?
    s, ms = time_string.replace("+", "").split('.')
    return int(s) + int(ms) / 1000


def interval_human_readable(time_string) -> float:
    if time_string[0] == "+":
        return time_string[1:]
    return time_string


def extract_TimingData(value, datetime):
    points = []
    try:
        # Last lap time
        result = get_LastLapTime_from_TimingData(value)
        if len(result) > 0:
            for r in result:
                driverNo, speed = r
                driverName = driver_no_to_name(driverNo)
                log.info("Last lap: %s - %s", driverName, speed)

                point = Point("lastLapTime") \
                    .field("LastLapTime", speed) \
                    .tag("driver", driverName) \
                    .time(datetime, WritePrecision.NS)
                points.append(point)

        # GapToLeader
        result = get_GapToLeader_from_TimingData(value)
        if len(result) > 0:
            for r in result:
                driverNo, gap = r
                driverName = driver_no_to_name(driverNo)
                log.info("Gap to Leader: %s - %s", driverName, gap)

                point = Point("gapToLeader") \
                    .field("GapToLeader", interval_to_timespan(gap)) \
                    .field("GapToLeaderHumanReadable", interval_human_readable(gap)) \
                    .tag("driver", driverName) \
                    .time(datetime, WritePrecision.NS)
                points.append(point)

        # IntervalToPositionAhead
        result = get_IntervalToPositionAhead_from_TimingData(value)
        if len(result) > 0:
            for r in result:
                driverNo, interval = r
                driverName = driver_no_to_name(driverNo)
                log.info("Gap to Leader: %s - %s", driverName, interval)

                point = Point("intervalToPositionAhead") \
                    .field("IntervalToPositionAhead", interval) \
                    .tag("driver", driverName) \
                    .time(datetime, WritePrecision.NS)
                points.append(point)

        # NumberOfLaps
        result = get_NumberOfLaps_from_TimingData(value)
        if len(result) > 0:
            for r in result:
                driverNo, lapNumber = r
                driverName = driver_no_to_name(driverNo)
                log.info("NumberOfLaps: %s - %s", driverName, lapNumber)

                point = Point("numberOfLaps") \
                    .field("NumberOfLaps", lapNumber) \
                    .tag("driver", driverName) \
                    .time(datetime, WritePrecision.NS)
                points.append(point)

        # Speed trap
        result = get_SpeedTrap_from_TimingData(value)
        if len(result) > 0:
            for r in result:
                driverNo, speed = r
                driverName = driver_no_to_name(driverNo)
                log.info("Speed trap: %s - %s", driverName, speed)

                point = Point("speedTrap") \
                    .field("Speed", speed) \
                    .tag("driver", driverName) \
                    .time(datetime, WritePrecision.NS)
                points.append(point)
    except Exception as e:
        log.exception("Unable to extract TimingData: %s %s", value, e)

    return points


def extract_RaceControlMessages(value, datetime):
    try:
        rcm = list(value["Messages"].values())[0]["Message"]
        log.info("RaceControlMessage: %s", rcm)

        point = Point("raceControlMessage") \
            .field("Message", rcm) \
            .time(datetime, WritePrecision.NS)
        return [point]
    except Exception as e:
        log.exception("Unable to extract RaceControlMessages: %s %s", value, e)
        return []


def extract_WeatherData(value, datetime):
    try:
        w = value
        log.info("WeatherData: %s", w)

        point = Point("weatherData") \
            .field("AirTemp", float(w["AirTemp"])) \
            .field("Humidity", float(w["Humidity"])) \
            .field("Pressure", float(w["Pressure"])) \
            .field("Rainfall", float(w["Rainfall"])) \
            .field("TrackTemp", float(w["TrackTemp"])) \
            .field("WindDirection", float(w["WindDirection"])) \
            .field("WindSpeed", float(w["WindSpeed"])) \
            .time(datetime, WritePrecision.NS)
        return [point]
    except Exception as e:
        log.exception("Unable to extract WeatherData: %s %s", value, e)
        return []


def handle_message(key, message, datetime) -> list:
    if key == 'TimingData':
        return extract_TimingData(message, datetime)
    elif key == 'RaceControlMessages':
        return extract_RaceControlMessages(message, datetime)
    elif key == 'WeatherData':
        return extract_WeatherData(message, datetime)
    else:
        return []
