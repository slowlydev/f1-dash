import { DriverType } from "../../types/driver.type";

const exampleDriver: DriverType = {
  nr: "63",
  broadcastName: "G RUSSELL",
  fullName: "George RUSSELL",
  firstName: "George",
  lastName: "Russell",
  short: "RUS",
  country: "GBR",
  line: 1,
  position: "1",
  teamName: "Mercedes",
  teamColor: "6CD3BF",
  status: null,
  cutoff: false,
  laps: 10,
  gapToFront: "",
  gapToLeader: "",
  catchingFront: false,
  sectors: [
    {
      current: {
        value: "17.159",
        fastest: true,
        pb: true,
      },
      last: {
        value: "",
        fastest: false,
        pb: false,
      },
      segments: [2051, 2051, 2051, 2051, 2049, 2049],
    },
    {
      current: {
        value: "30.401",
        fastest: false,
        pb: true,
      },
      last: {
        value: "",
        fastest: false,
        pb: false,
      },
      segments: [2049, 2049, 2049, 2051, 2048, 2048, 2049],
    },
    {
      current: {
        value: "",
        fastest: false,
        pb: false,
      },
      last: {
        value: "21.479",
        fastest: false,
        pb: false,
      },
      segments: [2049, 2051, 0, 0, 0, 0, 0],
    },
  ],
  stints: [
    {
      compound: "soft",
      laps: 3,
      new: false,
    },
    {
      compound: "soft",
      laps: 3,
      new: false,
    },
  ],
  lapTimes: {
    best: {
      value: "1:08.960",
      fastest: false,
      pb: true,
    },
    last: {
      value: "1:10.819",
      fastest: false,
      pb: true,
    },
  },
  drs: {
    on: false,
    possible: false,
  },
  metrics: {
    gear: 2,
    rpm: 7734,
    speed: 87,
  },
  positionChange: 0,
};
