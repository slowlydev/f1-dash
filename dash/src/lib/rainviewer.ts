import type { Rainviewer } from "@/types/rainviewer.type";

const rainviewerUrl = "https://api.rainviewer.com/public/weather-maps.json";

export const getRainviewer = async (): Promise<Rainviewer | null> => {
	try {
		const response = await fetch(rainviewerUrl);

		if (!response.ok) {
			return null;
		}

		return response.json();
	} catch {
		return null;
	}
};
