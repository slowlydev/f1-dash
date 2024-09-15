import Image from "next/image";

import Note from "@/components/Note";
import Footer from "@/components/Footer";
import DriverDRS from "@/components/driver/DriverDRS";
import DriverTire from "@/components/driver/DriverTire";
import DriverPedals from "@/components/driver/DriverPedals";

import unknownTireIcon from "public/tires/unknown.svg";
import mediumTireIcon from "public/tires/medium.svg";
import interTireIcon from "public/tires/intermediate.svg";
import hardTireIcon from "public/tires/hard.svg";
import softTireIcon from "public/tires/soft.svg";
import wetTireIcon from "public/tires/wet.svg";

export default function HelpPage() {
	return (
		<div className="container mx-auto mb-10 max-w-screen-lg px-4">
			<h1 className="my-4 text-3xl">Help Page</h1>

			<p>This page explains some core features and UI elements of f1-dash.</p>

			<h2 className="my-4 text-2xl">Colors</h2>

			<p>
				A core element in the UI of f1-dash and formula 1 are the different colors used for lap times, sector times,
				mini sectors, and gaps. Each color has a meaning in the context of the lap times, sector times or mini sectors.
			</p>

			<div className="my-4 flex flex-col">
				<div className="flex gap-1">
					<p className="flex items-center gap-1">
						<span className="size-4 rounded-md bg-white" /> White
					</p>
					<p>last lap time</p>
				</div>

				<div className="flex gap-1">
					<p className="flex items-center gap-1 text-yellow-500">
						<span className="size-4 rounded-md bg-yellow-500" /> Yellow
					</p>
					<p>slower than personal best</p>
				</div>

				<div className="flex gap-1">
					<p className="flex items-center gap-1 text-emerald-500">
						<span className="size-4 rounded-md bg-emerald-500" /> Green
					</p>
					<p>personal best</p>
				</div>

				<div className="flex gap-1">
					<p className="flex items-center gap-1 text-violet-500">
						<span className="size-4 rounded-md bg-violet-500" /> Purple
					</p>
					<p>overall best</p>
				</div>
			</div>

			<Note>
				Only mini sectors use the yellow color as it would make the UI not look good if a lot of drivers are not
				improving their lap times, and all text in the UI would be yellow.
			</Note>

			<h2 className="my-4 text-2xl">Leader board</h2>

			<p className="mb-4">
				The leader board shows all the drivers of the ongoing session. Depending on the drivers status and the sessions
				progression some drivers may have a colored background.
			</p>

			<div className="grid grid-cols-1 gap-x-4 divide-y divide-zinc-800 sm:grid-cols-3 sm:divide-y-0">
				<div>
					<p className="rounded-md bg-violet-800 bg-opacity-30 p-2">Driver has purple background</p>
					<p className="p-2">Driver has the fastest overall lap time.</p>
				</div>

				<div className="pt-4 sm:pt-0">
					<p className="rounded-md border p-2 opacity-50">Driver is a bit transparent</p>
					<p className="p-2">Driver crashed or retired from the session.</p>
				</div>

				<div className="pt-4 sm:pt-0">
					<p className="rounded-md bg-red-800 bg-opacity-30 p-2">Red background.</p>
					<p className="p-2">Driver is in the danger zone during qualifying.</p>
				</div>
			</div>

			<h2 className="my-4 text-2xl">DRS & PIT Status</h2>

			<p className="mb-4">
				Each driver in the leader board has this DRS and PIT Status indicator, it shows whether a driver has no DRS, was{" "}
				{"<"}1s behind the driver ahead and got DRS in the detection zone, has DRS active or is in the pit lane or
				leaving the pit lane.
			</p>

			<p className="mb-4">
				Overall it gives you a quick overview if the driver is going in the PITs and might drop a few places behind. or
				If the driver got DRS and has a chance to overtake the driver ahead.
			</p>

			<div className="mb-4 flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<div className="w-[4rem]">
						<DriverDRS on={false} possible={false} inPit={false} pitOut={false} />
					</div>

					<p>Off: no drs (default)</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="w-[4rem]">
						<DriverDRS on={false} possible={true} inPit={false} pitOut={false} />
					</div>

					<p>Possible: got DRS in next zone</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="w-[4rem]">
						<DriverDRS on={true} possible={false} inPit={false} pitOut={false} />
					</div>

					<p>Active: DRS is active</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="w-[4rem]">
						<DriverDRS on={false} possible={false} inPit={true} pitOut={false} />
					</div>

					<p>PIT: in the pit lane or leaving</p>
				</div>
			</div>

			<h2 className="my-4 text-2xl">Tires</h2>

			<p className="mb-4">
				We also show the different tires a driver can have and how many laps he has done on it. <br />
				In this example the driver has a soft tire which is 12 laps old and he pitted one time.
			</p>

			<div className="mb-4">
				<DriverTire
					stints={[
						{ totalLaps: 12, compound: "SOFT" },
						{ totalLaps: 12, compound: "SOFT", new: "TRUE" },
					]}
				/>
			</div>

			<p className="mb-4">These are the different icons for the different tire compounds</p>

			<div className="mb-4 flex flex-wrap gap-4">
				<div className="flex items-center gap-2">
					<Image src={softTireIcon} alt="soft" className="size-8" />
					<p>Soft</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={mediumTireIcon} alt="medium" className="size-8" />
					<p>Medium</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={hardTireIcon} alt="hard" className="size-8" />
					<p>Hard</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={interTireIcon} alt="intermediate" className="size-8" />
					<p>Intermediate</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={wetTireIcon} alt="wet" className="size-8" />
					<p>Wet</p>
				</div>

				<div className="flex items-center gap-2">
					<Image src={unknownTireIcon} alt="unknown" className="size-8" />
					<p>Unknown</p>
				</div>
			</div>

			<Note className="mb-4">
				Sometimes the tire type is unknown, this can happen at the beginning of the session or when something went
				wrong.
			</Note>

			<h2 className="my-4 text-2xl">Delay Control</h2>

			<p className="mb-4">
				When using f1-dash while watching on TV or on F1TV or your favorite streaming platform you will notice that
				f1-dash updates much earlier than your stream this might make very interesting race events less interesting as
				you see them on f1-dash before experiencing them on your stream. This is where the delay control comes in.
			</p>

			<p className="mb-4">
				With delay control you can set a delay in seconds to make f1-dash update later than it would normally do. So
				when setting a 30 seconds delay f1-dash will update 30 seconds later than it would normally do.
				<br />
				You can use this to sync your stream with f1-dash.
			</p>

			<Note className="mb-4">
				Currently you can only set a delay that is the time you have been on the dashboard page. So 30s on a 20s page
				visit make you wait 10s until playback of the updates resumes. (This will be changed in the future)
			</Note>

			<h3 className="my-4 text-xl">Options to sync</h3>

			<p className="mb-4">There are multiple ways you can set your delay so f1-dash is synced to your stream.</p>

			<div className="mb-4 flex gap-2">
				<div className="flex gap-1">
					<p className="text-sm text-zinc-500">1</p>
					<div className="flex size-8 items-center justify-center">
						<svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 6.26795C13.3333 7.03775 13.3333 8.96225 12 9.73205L3 14.9282C1.66667 15.698 0 14.7358 0 13.1962L0 2.80385C0 1.26425 1.66667 0.301996 3 1.0718L12 6.26795Z"
								fill="white"
							/>
						</svg>
					</div>
				</div>

				<div className="flex gap-1">
					<p className="text-sm text-zinc-500">2</p>
					<div className="w-[5rem]">
						<form className="flex rounded-lg bg-zinc-800 p-2">
							<input
								placeholder="0s"
								className="w-16 bg-zinc-800 text-center leading-none text-white placeholder-white"
							/>
						</form>
					</div>
				</div>
			</div>

			<div className="flex gap-1">
				<p className="text-sm text-zinc-500">1</p>
				<p className="mb-2">
					You can use the start and stop button in the most top bar on the dashboard page. So you can setup your delay
					without counting seconds.
				</p>
			</div>

			<div className="flex gap-1">
				<p className="text-sm text-zinc-500">2</p>
				<p className="mb-2">
					Either you manually input a delay in seconds, this you usually do if you know what kind of delays you usually
					need or if you want to make small adjustments without the start/stop button.
				</p>
			</div>

			<h3 className="my-4 text-xl">What to look for when syncing?</h3>

			<ul className="list ml-6 list-disc">
				<li>
					Start of a new lap <span className="text-zinc-500">(race)</span>
				</li>
				<li>
					Session clock <span className="text-zinc-500">(practice, qualifying)</span>
				</li>
				<li>If available mini sectors</li>
			</ul>

			<h2 className="my-4 text-2xl">Windows</h2>

			<p className="mb-4">
				On desktop and laptops and if your browser supports it you can open certain parts of f1-dash in a separate
				windows. This can be useful if you have a second screen and want things like the track map, track violations and
				more on a separate screen.
			</p>

			<p className="mb-4">
				You can open additional windows with the "Windows" menu item on the most top bar when on the dashboard page
			</p>

			<Note>
				The additional windows will not update when the main tab is not active and they will close when leaving live
				timing.
			</Note>

			<h2 className="my-4 text-2xl">Modes</h2>

			<p className="mb-4">
				The Modes allow you to toggle certain parts of the f1-dash UI, depending on the session, if you need, don't need
				or like them.
			</p>

			<p className="mb-4">
				There are currently 3 predefined modes you can switch between, you can also customize the "Custom" mode in the
				settings page.
			</p>

			<Note>
				Currently this does not do a lot, but in the future you can customize the UI to your liking and save it as a
				mode.
			</Note>

			<h2 className="my-4 text-2xl">Driver Pedals</h2>

			<div className="mb-4 flex flex-col gap-4">
				<div className="flex items-center gap-6">
					<div className="w-[4rem]">
						<DriverPedals className="bg-red-500" value={1} maxValue={3} />
					</div>

					<p>
						Shows if the driver is breaking <span className="text-zinc-500">(on / off)</span>
					</p>
				</div>

				<div className="flex items-center gap-6">
					<div className="w-[4rem]">
						<DriverPedals className="bg-emerald-500" value={3} maxValue={4} />
					</div>

					<p>
						Shows how much the driver is pressing the throttle pedal <span className="text-zinc-500">(0-100%)</span>
					</p>
				</div>

				<div className="flex items-center gap-6">
					<div className="w-[4rem]">
						<DriverPedals className="bg-blue-500" value={2} maxValue={3} />
					</div>

					<p>
						Shows the engine's RPM <span className="text-zinc-500">(0 - 15'000)</span>
					</p>
				</div>
			</div>

			<Footer />
		</div>
	);
}
