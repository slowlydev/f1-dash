import {
	BackendCarData,
	BackendDriverList,
	BackendExtrapolatedClock,
	BackendLapCount,
	BackendPosition,
	BackendRaceControlMessages,
	BackendSessionData,
	BackendSessionInfo,
	BackendState,
	BackendTeamRadio,
	BackendTimingAppData,
	BackendTimingData,
	BackendTimingStats,
	BackendTrackStatus,
	BackendWeatherData,
} from "../types/backend-state.type";
import {
	DriverType,
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
	TeamRadio,
	TrackStatus,
	Weather,
} from "../types/state.type";

import { toTrackTime } from "./toTrackTime";

export const translateExtrapolatedClock = (e: BackendExtrapolatedClock): ExtrapolatedClock => {
	return {
		extrapolating: e.Extrapolating,
		remaining: e.Remaining,
		utc: e.Utc,
	};
};

export const translateSessionData = (e: BackendSessionData): SessionData => {
	return {
		status: e.StatusSeries.map((e2) => ({
			utc: e2.Utc,
			trackStatus: e2.TrackStatus,
		})),
	};
};

export const translateSession = (e: BackendSessionInfo, td: BackendTimingData): SessionInfo => {
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
		typeName: e.Name,
		...(td.SessionPart && { number: td.SessionPart }),
	};
};

export const translateTrackStatus = (e: BackendTrackStatus): TrackStatus => {
	return {
		status: parseInt(e.Status), // TODO check
		statusMessage: e.Message,
	};
};

export const translateLapCount = (e: BackendLapCount): LapCount => {
	return {
		current: e.CurrentLap,
		total: e.TotalLaps,
	};
};

export const translateWeather = (e: BackendWeatherData): Weather => {
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

export const translateRaceControlMessages = (
	e: BackendRaceControlMessages,
	si: BackendSessionInfo,
): RaceControlMessage[] => {
	return e.Messages.map((e2) => ({
		trackTime: toTrackTime(e2.Utc, si.GmtOffset),
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

export const translateTeamRadios = (
	e: BackendTeamRadio,
	drivers: BackendDriverList,
	sessionInfo: BackendSessionInfo,
): TeamRadio[] => {
	return e.Captures.map((capture): TeamRadio | null => {
		const driver = drivers[capture.RacingNumber] ?? null;

		if (!driver) return null;

		return {
			driverNr: capture.RacingNumber,

			broadcastName: driver.BroadcastName,
			fullName: driver.FullName,
			firstName: driver.FirstName,
			lastName: driver.LastName,
			short: driver.Tla,

			teamColor: driver.TeamColour,

			utc: capture.Utc,
			audioUrl: `https://livetiming.formula1.com/static/${sessionInfo.Path}${capture.Path}`,
		};
	}).filter((v) => v !== null) as TeamRadio[];
};

export const translatePositions = (
	e: BackendPosition,
	drivers: BackendDriverList,
	td: BackendTimingData,
): DriverPositionBatch[] => {
	return e.Position.map(
		(e): DriverPositionBatch => ({
			utc: e.Timestamp,
			positions: Object.entries(e.Entries)
				.map(([nr, e2]): DriverPosition | null => {
					const driver = drivers[nr] ?? null;
					const tdDriver = td.Lines[nr] ?? null;

					if (!driver) return null;
					if (!tdDriver) return null;

					// e2.Status seems basically useless
					// thats why i am using the timing driver status

					return {
						driverNr: nr,
						position: tdDriver.Position,

						broadcastName: driver.BroadcastName,
						fullName: driver.FullName,
						firstName: driver.FirstName,
						lastName: driver.LastName,
						short: driver.Tla,

						teamColor: driver.TeamColour,

						status: tdDriver.KnockedOut
							? "OUT"
							: !!tdDriver.Cutoff
							? "CUTOFF"
							: tdDriver.Retired
							? "RETIRED"
							: tdDriver.Stopped
							? "STOPPED"
							: tdDriver.InPit
							? "PIT"
							: tdDriver.PitOut
							? "PIT OUT"
							: null,

						x: e2.X,
						y: e2.Y,
						z: e2.Z,
					};
				})
				.filter((v) => v !== null) as DriverPosition[],
		}),
	);
};

export const translateDrivers = (
	dl: BackendDriverList,
	td: BackendTimingData,
	ts: BackendTimingStats,
	cd: BackendCarData | undefined,
	tad: BackendTimingAppData,
): DriverType[] => {
	return Object.entries(dl)
		.map(([nr, driver]): DriverType | null => {
			const tdDriver = td.Lines[nr];
			const car = cd ? cd.Entries[cd.Entries.length - 1]?.Cars[nr]?.Channels : null;
			const timingStats = ts.Lines?.[nr] ?? null;
			const appTiming = tad.Lines?.[nr] ?? null;

			const statsNumber = td.SessionPart ? td.SessionPart - 1 : 0;

			if (!tdDriver || !timingStats || !appTiming) return null;

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
				positionChange: parseInt(appTiming.GridPos) - parseInt(tdDriver.Position),

				teamName: driver.TeamName,
				teamColor: driver.TeamColour,

				status: tdDriver.KnockedOut
					? "OUT"
					: !!tdDriver.Cutoff
					? "CUTOFF"
					: tdDriver.Retired
					? "RETIRED"
					: tdDriver.Stopped
					? "STOPPED"
					: tdDriver.InPit
					? "PIT"
					: tdDriver.PitOut
					? "PIT OUT"
					: null,

				danger: !!tdDriver.Cutoff,

				laps: tdDriver.NumberOfLaps,

				gapToLeader:
					tdDriver.GapToLeader ??
					(tdDriver.Stats ? tdDriver.Stats[statsNumber].TimeDiffToFastest : undefined) ??
					tdDriver.TimeDiffToFastest ??
					"",
				gapToFront:
					tdDriver.IntervalToPositionAhead?.Value ??
					(tdDriver.Stats ? tdDriver.Stats[statsNumber].TimeDifftoPositionAhead : undefined) ??
					tdDriver.TimeDiffToPositionAhead ??
					"",

				catchingFront: tdDriver.IntervalToPositionAhead?.Catching ?? false,

				sectors: tdDriver.Sectors.map(
					(e): Sector => ({
						current: {
							value: e.Value,
							fastest: e.OverallFastest,
							pb: e.PersonalFastest,
						},
						last: {
							value: e.PreviousValue ?? "",
							fastest: false,
							pb: false,
						},
						segments: e.Segments.map((e2) => e2.Status),
					}),
				),

				stints: appTiming.Stints
					? appTiming.Stints.map(
							(e): Stint => ({
								compound: (e.Compound ?? "hard").toLowerCase() as Stint["compound"],
								laps: e.TotalLaps ?? 0,
								new: e.New === "true",
							}),
					  )
					: [],

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
					on: [10, 12, 14].includes(car ? car[45] : 0),
					possible: tdDriver.IntervalToPositionAhead
						? parseFloat(tdDriver.IntervalToPositionAhead.Value.substring(1)) < 1
						: false, // TODO check if valid
				},

				metrics: {
					gear: car ? car["3"] : 0,
					rpm: car ? car["0"] : 0,
					speed: car ? car["2"] : 0,
				},
			};
		})
		.filter((v) => v !== null) as DriverType[];
};

export const transfrom = (state: BackendState): State => {
	return {
		...(state.ExtrapolatedClock && { extrapolatedClock: translateExtrapolatedClock(state.ExtrapolatedClock) }),
		...(state.SessionData && { sessionData: translateSessionData(state.SessionData) }),
		...(state.TrackStatus && { trackStatus: translateTrackStatus(state.TrackStatus) }),
		...(state.LapCount && { lapCount: translateLapCount(state.LapCount) }),
		...(state.WeatherData && { weather: translateWeather(state.WeatherData) }),
		...(state.SessionInfo && state.TimingData && { session: translateSession(state.SessionInfo, state.TimingData) }),

		...(state.RaceControlMessages &&
			state.SessionInfo && {
				raceControlMessages: translateRaceControlMessages(state.RaceControlMessages, state.SessionInfo),
			}),

		...(state.TeamRadio &&
			state.DriverList &&
			state.SessionInfo && { teamRadios: translateTeamRadios(state.TeamRadio, state.DriverList, state.SessionInfo) }),

		...(state.Position &&
			state.DriverList &&
			state.TimingData && { positionBatches: translatePositions(state.Position, state.DriverList, state.TimingData) }),

		// TODO maybe make work without other categories
		...(state.DriverList &&
			state.TimingData &&
			state.TimingStats &&
			state.TimingAppData && {
				drivers: translateDrivers(
					state.DriverList,
					state.TimingData,
					state.TimingStats,
					state.CarData,
					state.TimingAppData,
				),
			}),
	};
};
