const DEFAULT_LAP_MS = 90_000;

// behind by more than this after an update (tab was hidden, reconnect...):
// jump instead of racing around the track
const MAX_CATCH_UP_SEGMENTS = 3;

export type CarObservation = {
	/** segments completed in the current lap, 0 to `total` */
	completed: number;
	total: number;
	/** pit laps would poison the next lap's expected timing */
	inPit: boolean;
	/** last lap time, used until a segment has been timed */
	fallbackLapMs: number | null;
};

/**
 * Estimates where a car is between mini sector updates, the only position data
 * the feed provides. Each mini sector is timed as the car completes it, and the
 * car then moves towards the next one taking the time that one took last lap.
 *
 * Each move starts from the drawn position, so a car running ahead of or behind
 * the estimate speeds up or slows down instead of jumping.
 *
 * Progress is in laps and only increases: 2.25 is a quarter into the third lap.
 */
export const createCarMotion = () => {
	const durations = new Map<number, number>();

	let lap = 0;
	let total = 0;
	let completed: number | null = null;
	let arrivedAt = 0;

	let from = 0;
	let to = 0;
	let startedAt = 0;
	let moveDuration = 0;

	const progressAt = (now: number): number | null => {
		if (completed === null) return null;
		if (moveDuration <= 0) return to;

		return from + (to - from) * Math.min((now - startedAt) / moveDuration, 1);
	};

	const expectedDuration = (segment: number, fallbackLapMs: number | null): number => {
		const known = durations.get(segment);
		if (known !== undefined) return known;

		return (fallbackLapMs && fallbackLapMs > 0 ? fallbackLapMs : DEFAULT_LAP_MS) / total;
	};

	const moveFrom = (position: number, now: number, fallbackLapMs: number | null, current: number) => {
		from = position;
		to = lap + (current + 1) / total;
		startedAt = now;
		moveDuration = expectedDuration(current % total, fallbackLapMs);
	};

	const observe = ({ completed: next, total: nextTotal, inPit, fallbackLapMs }: CarObservation, now: number) => {
		if (nextTotal <= 0) return;

		if (completed === null || nextTotal !== total) {
			total = nextTotal;
			completed = next;
			arrivedAt = now;
			moveFrom(lap + next / total, now, fallbackLapMs, next);
			return;
		}

		if (next === completed) return;

		const previous = completed;
		const wrapped = previous - next > total / 2;

		// a sector resetting late can briefly move the count backwards
		if (next < previous && !wrapped) return;

		// crossing the line is reported as the count resetting; the car is
		// already there, so keep moving and timing from the original arrival
		if (wrapped && next === 0 && previous === total) {
			lap += 1;
			completed = 0;
			return;
		}

		const startedSegment = wrapped ? 0 : previous;
		const singleStep = wrapped ? previous === total && next === 1 : next === previous + 1;

		if (singleStep && !inPit) durations.set(startedSegment, now - arrivedAt);

		if (wrapped) lap += 1;

		const position = progressAt(now) ?? 0;
		const reached = lap + next / total;

		completed = next;
		arrivedAt = now;

		moveFrom(reached - position > MAX_CATCH_UP_SEGMENTS / total ? reached : position, now, fallbackLapMs, next);
	};

	return { observe, progressAt };
};
