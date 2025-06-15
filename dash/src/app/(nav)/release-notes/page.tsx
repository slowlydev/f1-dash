import { ArrowLeft, Tag, Clock, Github } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ReleaseNote {
	version: string;
	date: string;
	title: string;
	description: string;
	changes: {
		type: "feature" | "fix" | "improvement" | "docs";
		description: string;
	}[];
	commitHash?: string;
	downloadUrl?: string;
}

const releaseNotes: ReleaseNote[] = [
	{
		version: "v3.0.1",
		date: "May 2, 2025",
		title: "Bug Fixes",
		description: "This release focuses on bug fixes.",
		changes: [
			{ type: "fix", description: "Improved cords fetching for weather map" },
			{ type: "fix", description: "Show nav when buffering on mobile" },
		],
		commitHash: "4995baf",
		downloadUrl: "https://github.com/slowlydev/f1-dash/releases/tag/v3.0.1",
	},
	{
		version: "v3.0.0",
		date: "April 29, 2025",
		title: "First proper release!",
		description: "Complete overhaul of the dashboard",
		changes: [
			{ type: "improvement", description: "New ui for dashboard page" },
			{ type: "feature", description: "New weather map page" },
			{
				type: "improvement",
				description: "settings page is not integrated into live timing (no delay waiting times 🎉)",
			},
			{ type: "improvement", description: "improved CI/CD" },
		],
		commitHash: "bebeec9",
		downloadUrl: "https://github.com/slowlydev/f1-dash/releases/tag/v3.0.0",
	},
	{
		version: "v2.7.0",
		date: "April 17, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{ type: "fix", description: "Fix docker compose" },
			{ type: "improvement", description: "Add back the delay timer to easily set a delay" },
			{ type: "improvement", description: "Formatting" },
		],
		commitHash: "0e7bfdd",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/233",
	},
	{
		version: "v2.6.1",
		date: "April 8, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [{ type: "improvement", description: "uses env vars to configure tracking" }],
		commitHash: "9968131",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/226",
	},
	{
		version: "v2.6.0",
		date: "April 17, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{ type: "fix", description: "Delay is now more consistent across the different kinds of data" },
			{ type: "improvement", description: "Adds information about weather on help page" },
		],
		commitHash: "e8519e8",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/224",
	},
	{
		version: "v2.5.3",
		date: "March 15, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{ type: "fix", description: "Fixes failed Docker Build" },
			{
				type: "fix",
				description:
					"Fixes frontend docker image not having static public folder in runner step causing images to not be found",
			},
			{ type: "improvement", description: "adds usage of corepack to dashboard docker image" },
			{ type: "improvement", description: "update to node 22 in dashboard docker image" },
			{ type: "fix", description: "fixes missing padding in team radio loading skeleton" },
		],
		commitHash: "5cba273",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/210",
	},
	{
		version: "v2.5.2",
		date: "March 15, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [{ type: "fix", description: "Potential fix failed Docker Build" }],
		commitHash: "74c0087",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/209",
	},
	{
		version: "v2.5.1",
		date: "February 28, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{
				type: "fix",
				description: "fixes unit change fixed to screen position on settings when the page is scrollable",
			},
			{ type: "fix", description: "fixes Speed unit selector has fixed position" },
		],
		commitHash: "3f067d0",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/206",
	},
	{
		version: "v2.5.0",
		date: "February 20, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{ type: "feature", description: "add the ability to play a chime when there's a new race control message" },
		],
		commitHash: "228b2e9",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/203",
	},
	{
		version: "v2.4.2",
		date: "February 20, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [{ type: "fix", description: "fix dashboard page not clickable when fireworks are active" }],
		commitHash: "9755b07",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/202",
	},
	{
		version: "v2.4.1",
		date: "February 20, 2025",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{ type: "fix", description: "fix countdown being too low when next session is further ahead than under a month" },
		],
		commitHash: "b05923a",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/201",
	},
	{
		version: "v2.4.0",
		date: "December 8, 2024",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [{ type: "feature", description: "add special end of season thing" }],
		commitHash: "b6c2acb",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/198",
	},
	{
		version: "v2.3.1",
		date: "December 1, 2024",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [{ type: "fix", description: "fixed map being weird in certain screen sizes" }],
		commitHash: "18c6d43",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/193",
	},
	{
		version: "v2.3.0",
		date: "December 1, 2024",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{ type: "feature", description: "add back the best sector feature with corresponding settings toggles" },
			{ type: "improvement", description: "adjust the help page" },
		],
		commitHash: "19772d5",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/191",
	},
	{
		version: "v2.2.1",
		date: "November 19, 2024",
		title: "Bug Fixes and Minor Improvements",
		description: "This release addresses several bugs and adds minor improvements.",
		changes: [
			{
				type: "improvement",
				description:
					"rewrite of the buffer & data engine to fix the firefox memory leaks and general performance issues.",
			},
			{ type: "improvement", description: "rewrite to stores for state management" },
			{ type: "feature", description: "show current version in the footer" },
			{ type: "feature", description: "implemented favorite driver highlighting" },
		],
		commitHash: "708bc8e",
		downloadUrl: "https://github.com/slowlydev/f1-dash/pull/181",
	},
];

export default function ReleaseNotesPage() {
	return (
		<div className="container mx-auto max-w-5xl px-4 py-8 font-sans text-white">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<Link href="/" className="mb-2 flex items-center text-zinc-400 hover:text-zinc-300">
						<ArrowLeft className="mr-1 h-4 w-4" />
						Back to Dashboard
					</Link>
					<h1 className="text-3xl font-bold tracking-tight text-white">Release Notes</h1>
					<p className="mt-1 text-zinc-400">Track the evolution of F1 Dash with our version history and updates</p>
				</div>
				<Link href="https://github.com/slowlydev/f1-dash/releases" target="_blank">
					<Button className="flex items-center gap-2">
						<Github className="h-4 w-4" />
						View on GitHub
					</Button>
				</Link>
			</div>

			<div className="grid gap-8">
				{releaseNotes.map((release) => (
					<Card
						key={release.version}
						className="border-l-primary overflow-hidden rounded-2xl border-l-4 border-zinc-800 bg-[#1a1a1a] text-white"
					>
						<CardHeader className="bg-[#222222] p-2">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<div className="mb-1 flex items-center gap-2">
										<Badge variant="outline" className="h-5 border-zinc-700 px-2 py-0 font-mono text-xs text-white">
											{release.version}
										</Badge>
										<div className="flex items-center text-xs text-zinc-400">
											<Clock className="mr-1 h-3 w-3" />
											{release.date}
										</div>
										{release.commitHash && (
											<div className="hidden items-center text-xs text-zinc-400 sm:flex">
												<Tag className="mr-1 h-3 w-3" />
												<code className="font-mono">{release.commitHash}</code>
											</div>
										)}
									</div>
									<CardTitle className="text-white">{release.title}</CardTitle>
									<CardDescription className="mt-1 text-zinc-400">{release.description}</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="py-4 text-white p-2">
							<h3 className="mb-3 text-sm font-medium text-white">Changes in this release:</h3>
							<div className="space-y-3">
								{release.changes.map((change, index) => (
									<div key={index} className="flex gap-3">
										<Badge
											variant={
												change.type === "feature"
													? "default"
													: change.type === "fix"
														? "destructive"
														: change.type === "improvement"
															? "secondary"
															: "docs"
											}
											className="h-6 w-24 justify-center capitalize"
										>
											{change.type}
										</Badge>
										<p className="pt-0.5 text-sm text-zinc-200">{change.description}</p>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter className="flex justify-end bg-[#222222] py-3 p-2">
							<Link
								href={`https://github.com/slowlydev/f1-dash/commit/${release.commitHash}`}
								className="text-xs text-zinc-400 hover:text-zinc-300"
								target="_blank"
							>
								View commit details →
							</Link>
						</CardFooter>
					</Card>
				))}
			</div>

			<div className="mt-12 text-center">
				<p className="text-sm text-zinc-400">
					Looking for older releases? View the complete history on
					<Link
						href="https://github.com/slowlydev/f1-dash/releases"
						className="ml-1 text-zinc-300 hover:underline"
						target="_blank"
					>
						GitHub
					</Link>
				</p>
			</div>
		</div>
	);
}
