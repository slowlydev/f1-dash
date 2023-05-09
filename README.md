# f1-dash

```
f1 > data-provider > scylladb > data > dash
```

Depreacted:

```
data-simulator > data-provider > scylladb > data > dash
```

## servers

Dashboard Frontend:
http://localhost:3000/

Data Backend:
http://localhost:4000/

ScyllaDB
http://localhost:9042/

## important api stuff

https://livetiming.formula1.com/static/SessionInfo.json
https://livetiming.formula1.com/static/StreamingStatus.json
https://www.reddit.com/r/formula1/comments/b4t3q7/where_does_f1tfeednet_get_their_data/

## important events

```json
{
	"C": "d-25125E9D-B,0|RmG,0|RmH,11|d,2D9|Bf,2546|Bk,258A|a,6|Y,95|CC,0|Bq,660|W,4C7|c,A3|BY,15|X,EA|Bl,43|Bn,3|Bm,22|Z,0|Bp,7062",
	"M": [
		{
			"A": [
				"SessionData",
				{
					"StatusSeries": {
						"17": {
							"SessionStatus": "Finalised",
							"Utc": "2023-05-05T22:36:43.299Z"
						}
					}
				},
				"2023-05-05T22:36:43.299Z"
			],
			"H": "Streaming",
			"M": "feed"
		}
	]
}
```

## important code

### reading data out of z zipped CarData

https://github.com/theOehrly/Fast-F1/blob/90fc63fe8121b31f7b66ff5b3e7e11ec1bd1abf4/fastf1/_api.py#L845

### track status

https://github.com/theOehrly/Fast-F1/blob/90fc63fe8121b31f7b66ff5b3e7e11ec1bd1abf4/fastf1/_api.py#L1064
