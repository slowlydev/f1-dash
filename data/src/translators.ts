import {
	F1CarData,
	F1DriverList,
	F1ExtrapolatedClock,
	F1LapCount,
	F1Position,
	F1RaceControlMessages,
	F1SessionData,
	F1SessionInfo,
	F1State,
	F1TimingAppData,
	F1TimingData,
	F1TimingStats,
	F1TrackStatus,
	F1WeatherData,
} from "./formula1.type";
import {
	Driver,
	DriverPosition,
	DriverPositionBatch,
	ExtrapolatedClock,
	LapCount,
	RaceControlMessage,
	Sector,
	SessionData,
	SessionInfo,
	State,
	Stint,
	TrackStatus,
	Weather,
} from "./models";

export const translateExtrapolatedClock = (e: F1ExtrapolatedClock): ExtrapolatedClock => {
	return {
		extrapolating: e.Extrapolating,
		remaining: e.Remaining,
		utc: e.Utc,
	};
};

export const translateSessionData = (e: F1SessionData): SessionData => {
	return {
		status: e.StatusSeries.map((e2) => ({
			utc: e2.Utc,
			trackStatus: e2.TrackStatus,
		})),
	};
};

export const translateSession = (e: F1SessionInfo): SessionInfo => {
	return {
		name: e.Meeting.Name,
		officialName: e.Meeting.OfficialName,
		location: e.Meeting.Location,

		countryName: e.Meeting.Country.Name,
		countryCode: e.Meeting.Country.Code,

		circuitName: e.Meeting.Circuit.ShortName,
		circuitKey: e.Meeting.Circuit.Key,

		startDate: e.StartDate,
		endDate: e.EndDate,
		offset: e.GmtOffset,

		type: e.Type,
	};
};

export const translateTrackStatus = (e: F1TrackStatus): TrackStatus => {
	return {
		status: parseInt(e.Status), // TODO check
		statusMessage: e.Message,
	};
};

export const translateLapCount = (e: F1LapCount): LapCount => {
	return {
		current: e.CurrentLap,
		total: e.TotalLaps,
	};
};

export const translateWeather = (e: F1WeatherData): Weather => {
	return {
		humidity: parseFloat(e.Humidity),
		pressure: parseFloat(e.Pressure),
		rainfall: parseInt(e.Rainfall),
		wind_direction: parseInt(e.WindDirection),
		wind_speed: parseFloat(e.WindSpeed),
		air_temp: parseFloat(e.AirTemp),
		track_temp: parseFloat(e.TrackTemp),
	};
};

export const translateRaceControlMessages = (e: F1RaceControlMessages): RaceControlMessage[] => {
	return e.Messages.map((e2) => ({
		utc: e2.Utc,
		lap: e2.Lap,
		message: e2.Message,
		category: e2.Category,

		...(e2.Flag && { flag: e2.Flag }),
		...(e2.Scope && { scope: e2.Scope }),
		...(e2.Sector && { sector: e2.Sector }),
		...(e2.Status && { drsEnabled: e2.Status === "ENABLED" }),
	}));
};

export const translatePositions = (e: F1Position, drivers: F1DriverList): DriverPositionBatch[] => {
	return e.Position.map(
		(e): DriverPositionBatch => ({
			utc: e.Timestamp,
			positions: Object.entries(e.Entries).map(([nr, e2]): DriverPosition => {
				const driver = drivers[nr];

				return {
					driverNr: nr,

					broadcastName: driver.BroadcastName,
					fullName: driver.FullName,
					firstName: driver.FirstName,
					lastName: driver.LastName,
					short: driver.Tla,

					teamColor: driver.TeamColour,

					status: e2.Status,
					x: e2.X,
					y: e2.Y,
					z: e2.Z,
				};
			}),
		})
	);
};

export const translateDrivers = (dl: F1DriverList, td: F1TimingData, ts: F1TimingStats, cd: F1CarData, tad: F1TimingAppData): Driver[] => {
	return Object.entries(dl)
		.map(([nr, driver]): Driver | null => {
			const tdDriver = td.Lines[nr];
			const car = cd.Entries[cd.Entries.length - 1]?.Cars[nr]?.Channels ?? null;
			const timingStats = ts.Lines?.[nr] ?? null;
			const appTiming = tad.Lines?.[nr] ?? null;

			if (!tdDriver || !timingStats || !car || !appTiming) return null;

			return {
				nr,

				broadcastName: driver.BroadcastName,
				fullName: driver.FullName,
				firstName: driver.FirstName,
				lastName: driver.LastName,
				short: driver.Tla,
				country: driver.CountryCode,

				line: driver.Line,
				position: tdDriver.Position,

				teamName: driver.TeamName,
				teamColor: driver.TeamColour,

				status: tdDriver.KnockedOut
					? "OUT"
					: tdDriver.Retired
					? "RETIRED"
					: tdDriver.Stopped
					? "STOPPED"
					: tdDriver.InPit
					? "PIT"
					: tdDriver.PitOut
					? "PIT OUT"
					: null,

				laps: tdDriver.NumberOfLaps,

				gapToLeader: tdDriver.GapToLeader,
				gapToFront: tdDriver.IntervalToPositionAhead?.Value ?? "",
				catchingFront: tdDriver.IntervalToPositionAhead?.Catching ?? false,

				sectors: tdDriver.Sectors.map(
					(e): Sector => ({
						current: {
							value: e.Value,
							fastest: e.OverallFastest,
							pb: e.PersonalFastest,
						},
						// TODO find a smart way to keep the old state
						last: {
							value: e.Value,
							fastest: false,
							pb: false,
						},
						segments: e.Segments.map((e2) => e2.Status),
					})
				),

				stints: appTiming.Stints.map(
					(e): Stint => ({
						compound: (e.Compound ?? "hard").toLowerCase() as Stint["compound"],
						laps: e.TotalLaps ?? 0,
						new: e.New === "True",
					})
				),

				lapTimes: {
					best: {
						value: tdDriver.BestLapTime.Value,
						fastest: timingStats.PersonalBestLapTime.Position === 1,
						pb: true,
					},
					last: {
						value: tdDriver.LastLapTime.Value,
						fastest: tdDriver.LastLapTime.OverallFastest,
						pb: tdDriver.LastLapTime.PersonalFastest,
					},
				},

				drs: {
					on: [10, 12, 14].includes(car[45] ?? 0),
					possible: tdDriver.IntervalToPositionAhead ? parseFloat(tdDriver.IntervalToPositionAhead.Value.substring(1)) < 1 : false, // TODO check if valid
				},

				metrics: {
					gear: car["3"],
					rpm: car["0"],
					speed: car["2"],
				},
			};
		})
		.filter((v) => v !== null) as Driver[];
};

export const translate = (state: F1State): State => {
	return {
		...(state.ExtrapolatedClock && { extrapolatedClock: translateExtrapolatedClock(state.ExtrapolatedClock) }),
		...(state.SessionData && { sessionData: translateSessionData(state.SessionData) }),
		...(state.TrackStatus && { trackStatus: translateTrackStatus(state.TrackStatus) }),
		...(state.LapCount && { lapCount: translateLapCount(state.LapCount) }),
		...(state.WeatherData && { weather: translateWeather(state.WeatherData) }),
		...(state.SessionInfo && { session: translateSession(state.SessionInfo) }),

		...(state.Position && state.DriverList && { positionBatches: translatePositions(state.Position, state.DriverList) }),
		...(state.RaceControlMessages && { raceControlMessages: translateRaceControlMessages(state.RaceControlMessages) }),

		// TODO make work without other cats
		...(state.DriverList &&
			state.TimingData &&
			state.TimingStats &&
			state.CarData &&
			state.TimingAppData && {
				drivers: translateDrivers(state.DriverList, state.TimingData, state.TimingStats, state.CarData, state.TimingAppData),
			}),
	};
};