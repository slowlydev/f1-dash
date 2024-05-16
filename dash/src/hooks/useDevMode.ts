import { useEffect, useState } from "react";

export const useDevMode = () => {
	const [active, setActive] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window != undefined) {
			const isActive = !!localStorage.getItem("dev");
			setActive(isActive);
		}
	}, []);

	return { active };
};
