import { router } from "lib/router";
import { findArchive } from "./archive.service";

const app = router("/archive");

app.get("", null, () => {
	return findArchive();
});
