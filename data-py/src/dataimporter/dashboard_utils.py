import json
from typing import List

import typer

from dataimporter.message_handler import D_LOOKUP

app = typer.Typer()


@app.command()
def add_driver_color_to_dashboard_overrides(path_to_dashboard_json: str, dashboard_titles_to_process: List[str]):
    driver_color_list_overrides = []
    for driver_info in D_LOOKUP:
        driver_color_list_overrides.append(
            _color_matcher_section(driver_info[1], driver_info[3], driver_info[4] == 'DOT'))
    print(json.dumps(driver_color_list_overrides))

    driver_names = [driver[1] for driver in D_LOOKUP]
    print(driver_names)

    with open(path_to_dashboard_json, "r") as dashboard:
        dashboard_contents = dashboard.read()
    parsed_json = json.loads(dashboard_contents)

    # print(parsed_json)
    i = 0
    for panel in parsed_json['panels']:
        if panel['title'] in dashboard_titles_to_process and 'fieldConfig' in panel and 'overrides' in panel[
            'fieldConfig']:
            print("==================", panel['title'], "==================")
            overrides_without_driver_color = [o for o in panel['fieldConfig']['overrides']
                                              if 'matcher' not in o
                                              or 'id' not in o['matcher']
                                              or o['matcher']['id'] != 'byName'
                                              or 'options' not in o['matcher']
                                              or o['matcher']['options'] not in driver_names
                                              ]

            print("================== overrides_without_driver_color ==================")
            print(overrides_without_driver_color)

            print("================== new overrides_without_driver_color ==================")
            overrides_without_driver_color.extend(driver_color_list_overrides)
            print(overrides_without_driver_color)
            parsed_json['panels'][i]['fieldConfig']['overrides'] = overrides_without_driver_color
        i += 1

    # Writing to sample.json
    with open(path_to_dashboard_json, "w") as dashboard:
        dashboard.write(json.dumps(parsed_json, indent=4))


def _color_matcher_section(driver_name, driver_color_hex, dotted_line=False):
    if dotted_line:
        return {
            "matcher": {
                "id": "byName",
                "options": driver_name
            },
            "properties": [
                {
                    "id": "color",
                    "value": {
                        "fixedColor": driver_color_hex,
                        "mode": "fixed"
                    }
                }, {
                    "id": "custom.lineStyle",
                    "value": {
                        "dash": [
                            0,
                            5
                        ],
                        "fill": "dot"
                    }
                }
            ]
        }
    else:
        return {
            "matcher": {
                "id": "byName",
                "options": driver_name
            },
            "properties": [
                {
                    "id": "color",
                    "value": {
                        "fixedColor": driver_color_hex,
                        "mode": "fixed"
                    }
                }
            ]
        }


def main():
    app()


if __name__ == '__main__':
    main()
