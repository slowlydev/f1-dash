import { GridStack } from "@/lib/Grid";

export const DEFAULT_GRID: GridStack = {
	direction: "row",
	children: [
		{
			direction: "column",
			children: [
				{
					component: "leaderboard",
				},
				{
					direction: "row",
					children: [
						{
							component: "trackviolations",
							style: { width: "50%" },
						},
						{
							component: "teamradios",
							style: { height: "40rem", width: "50%" },
						},
					],
				},
			],
		},
		{
			direction: "column",
			style: { flexGrow: 1 },
			children: [
				{
					component: "trackmap",
				},
				{
					component: "racecontrol",
					style: { height: "20rem" },
				},
				// {
				// 	direction: "row",
				// 	style: { width: "100%" },
				// 	children: [
				// 		{
				// 			component: "driverChamptionship",
				// 			style: { width: "50%" },
				// 		},
				// 		{
				// 			component: "teamChampionship",
				// 			style: { width: "50%" },
				// 		},
				// 	],
				// },
			],
		},
	],
};
