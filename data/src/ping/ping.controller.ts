import { router } from "lib/router";

const app = router("/ping");

app.get("", null, () => {
	return { ping: "pong" };
});
