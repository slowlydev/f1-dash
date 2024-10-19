export const useDevMode = () => {
	let active = false;

	if (typeof window != undefined) {
		active = !!localStorage.getItem("dev");
	}

	return { active };
};
