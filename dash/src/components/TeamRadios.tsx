import { AnimatePresence } from "framer-motion";
import { utc } from "moment";

import { sortUtc } from "../lib/sortUtc";

import { TeamRadioType } from "../types/team-radio.type";

import TeamRadioMessage from "./TeamRadioMessage";

type Props = {
  teamRadios: TeamRadioType[] | undefined;
};

export default function TeamRadios({ teamRadios }: Props) {
  if (!teamRadios) return null;

  return (
    <ul className="flex flex-col gap-2">
      <AnimatePresence>
        {teamRadios.sort(sortUtc).map((teamRadio, i) => (
          <TeamRadioMessage
            key={`radio.${utc(teamRadio.utc).unix()}.${i}`}
            teamRadio={teamRadio}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
