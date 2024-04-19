export default function Page() {
	return (
		<div className="mt-4 ">
			<h1 className="mb-2 text-3xl font-extrabold">Infos about issues and v2</h1>

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
				In August 2023 I released f1-dash to the public by making a few posts here and there (mastodon, lemmy, tired
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

			<h2 className="my-2 text-2xl font-extrabold">Community</h2>

			<p className="mb-2 text-zinc-400">Currently the only way to interact with me or the community is either</p>

			<ul className="mb-2 ml-8 list-disc">
				<li className="list-item">Commenting under Social media posts spread across multiple platforms</li>
				<li className="list-item">Opening GitHub issues or pull requests and comments</li>
				<li className="list-item">
					Sending feedback on <code>improve.slowly.dev</code> but I have no way to contact you back or respond to your
					feedback.
				</li>
			</ul>

			<p className="mb-2 text-zinc-400">
				These different platforms are not really the best way to get feedback and build a community. That's why I am
				thinking of building a discord server or similar to have a place where the community can interact.
			</p>

			<p className="mb-2 text-zinc-400">
				But I want to ask you, the community, first, where you think the best place for a community would be. So I
				created this small form, which also includes some questions about the issues on f1-dash. I would be very
				thankful if you could fill it out.
			</p>

			<a className="text-lg text-blue-500" href="https://forms.gle/5UcevvAtryi6EeXc7">
				Google Forms about: f1-dash community questions
			</a>

			<h2 className="my-2 text-2xl font-extrabold">TL;DR;</h2>

			<p className="mb-2 text-zinc-400">
				Very thankful for the feedback and usage of f1-dash. The project grew faster than I expected and the backend was
				not able to keep up. I'm working on a new version of f1-dash which will hopefully fix the issues and bring a new
				design as well as new features.
			</p>

			<p className="mb-2 text-zinc-400">Also please fill out this form:</p>

			<a className="text-lg text-blue-500" href="https://forms.gle/5UcevvAtryi6EeXc7">
				Google Forms about: f1-dash community questions
			</a>
		</div>
	);
}
