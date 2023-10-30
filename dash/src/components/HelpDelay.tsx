import DelayInput from "./DelayInput";

export default function HelpDelay() {
	return (
		<div className="flex flex-col gap-2">
			<h3 className="mt-4 text-2xl font-semibold">The Random Input Box</h3>

			<p>U might have noticed this random Input box with a 0 in it.</p>

			<DelayInput setDebouncedDelay={() => {}} />

			<p>
				This is used to delay the realtime stream of data. <br />
				So u don't get spoilerd by f1-dash if your stream is behind. <br />
				The delay is in seconds.
			</p>
		</div>
	);
}
