export default function Page() {
	return (
		<div className="mt-4 ">
			<h1 className="mb-2 text-3xl font-extrabold">Infos about issues and v2 beta</h1>

			<div className="my-2 rounded-lg bg-blue-600 p-4">
				<p>
					f1-dash v2 beta is out now, feel free to test it and give feedback in the community Discord or on GitHub. You
					will find both links in the footer of the new website.
				</p>
				<a className="text-blue-300 underline" target="_blank" href="https://v2.f1-dash.com?utm_campaign=v2-beta">
					v2.f1-dash.com
				</a>
			</div>

			<p className="mb-2 text-zinc-400">
				Hey there! First thank you for being here, using f1-dash, it's been amazing seeing it being used and the
				feedback on it on different platforms, like GitHub, Twitter, Mastodon, <code>improve.slowly.dev</code> and more.
			</p>

			<p className="mt-4 text-lg">Lets start with a short view back to the past...</p>
			<p className="mb-4 text-sm text-zinc-400">(TL;DR; at the bottom of the page)</p>

			<p className="mb-2 text-zinc-400">
				Back in the beginning of 2023 I had the idea to develop f1-dash, and I started developing the backend which
				handles all the data from f1 and sends it to your browser. It took multiple attempts to get the backend right,
				as I was working with a new programming language (rust) which I never used before this project.
			</p>

			<p className="mb-2 text-zinc-400">
				Around June 2023 I decided to not write the backend in that language (rust) and rather stick to technologies I'm
				more familiar with (TypeScript). I was able to get the backend up and running in a few weeks and started working
				on the frontend, which was completed quite quickly.
			</p>

			<p className="mb-2 text-zinc-400">
				In August 2023 I released f1-dash to the public by making a few posts here and there (mastodon, lemmy, tried
				reddit, but was not able to post).
			</p>

			<h2 className="my-2 text-2xl font-extrabold">Issues</h2>

			<p className="mb-2 text-zinc-400">
				Over the 2023 season, a few people started using it regularly. Which was nice to see and the quickly thrown
				together backend was able to handle it without problems.
			</p>

			<p className="mb-2 text-zinc-400">
				But During 2024 Pre-Season Testing, that changed drastically, more people than ever where using f1-dash. Which
				was amazing to see, but there was one catch. The quickly thrown together backend was not able to handle these
				amounts of traffic anymore. Issues like the following started to appear:
			</p>

			<ul className="mb-2 ml-8 list-disc">
				<li className="list-item">too much outgoing traffic (more than 1 Gigabit)</li>
				<li className="list-item">too much CPU usage (backend running on raspberry PI)</li>
				<li className="list-item">too much RAM usage (4GB and climbing)</li>
			</ul>

			<p className="mb-2 text-zinc-400">
				These issues are the reason why f1-dash is not working as it should during the last Grand Prix weekends. It also
				was hard for me to fix the issues quickly as I am still an apprentice and work 4 days a week + 1 day of school +
				Assignments. And the Timezones for the last Grand Prix weekends were not in my favor, which makes it hard to fix
				and investigate the issues on the fly.
			</p>

			<h2 className="my-2 text-2xl font-extrabold">Up coming V2 release</h2>

			<p className="mb-2 text-zinc-400">
				Over the last year I've been working on a new version of f1-dash, which features a complete rewrite of the
				backend (finally using rust) and a redesign of the frontend website UI.
			</p>

			<p className="mb-2 text-zinc-400">
				I hope I can release the v2 soon™ and that it will mitigate the issues that appeared during the last few Grand
				Prix weekends.
			</p>
		</div>
	);
}
