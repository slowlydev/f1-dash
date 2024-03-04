import { bootstrap } from "lib/core";
import { cron } from "lib/cron";
import { runQuery } from "lib/database";
import "./archive/archive.controller";
import "./f1/f1.controller";
import { debug, error, info, warn } from "./log/log.service";
import "./meeting/meeting.controller";
import "./ping/ping.controller";
import { req } from "./req/req.service";
import { res } from "./res/res.service";

cron("* * * * 0 0", () => runQuery("vacuum"));
const server = bootstrap();
server.logger({ req, res, debug, info, warn, error });
