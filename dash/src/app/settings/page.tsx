"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import Toggle from "../../components/Toggle";

import { getEnabledFeatures } from "../../lib/getEnabledFeatures";

import arrowIcon from "../../../public/icons/arrow-up.svg";

type ExperimentalFeature = {
  key: string;
  title: string;
  description?: string;
};

const experimentalFeatures: ExperimentalFeature[] = [
  {
    key: "map",
    title: "Map",
    description: "Map of Racetrack and see where every driver is in real-time",
  },
  {
    key: "rcm",
    title: "Race Control Messages",
    description:
      "See Race Control's Messages in real-time, includes incidents, penalties, flags, track status",
  },
];

const selectSavedFeatures = (savedFeatures: string[]) => {
  return experimentalFeatures.filter((feature) =>
    savedFeatures.includes(feature.key)
  );
};

const sortFeatures = (a: string, b: string) => (a < b ? 1 : -1);

export default function SettingsPage() {
  // TODO favorite drivers
  // UI customization

  const [savedFeatures, setSavedFeatures] = useState(getEnabledFeatures());
  const [features, setFeatures] = useState(selectSavedFeatures(savedFeatures));
  const [experimental, setExperimental] = useState(features.length > 0);

  const toggleExperimental = (enable: boolean) => {
    if (!enable) setFeatures([]);
    setExperimental(enable);
  };

  const toggleFeature = (enable: boolean, feature: ExperimentalFeature) => {
    setFeatures((old) => {
      if (enable && !features.includes(feature)) {
        return [...old, feature];
      } else {
        return old.filter(
          (featureToCheck) => featureToCheck.key !== feature.key
        );
      }
    });
  };

  const saveFeatures = () => {
    const newSavedFeatures = features.map((feat) => feat.key);

    localStorage.setItem(
      "experimentalFeatures",
      JSON.stringify(newSavedFeatures)
    );
    setSavedFeatures(newSavedFeatures);
  };

  const resetFeatures = () => {
    setFeatures(selectSavedFeatures(savedFeatures));
  };

  const hasChanges =
    JSON.stringify(savedFeatures.sort(sortFeatures)) !==
    JSON.stringify(features.map((feat) => feat.key).sort(sortFeatures));

  const sectionClass = "flex items-center justify-between gap-4 py-4 sm:py-5";
  const sectionTitle = "text-md font-medium";
  const sectionDescription = "text-sm text-gray-500";
  const buttonClass =
    "inline-flex items-center rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-1.5 text-white shadow-sm focus:ring-2";

  return (
    <div className="container m-auto sm:pt-10">
      <Link href="/">
        <div className="mb-2 flex items-center gap-1">
          <Image
            src={arrowIcon}
            alt="arrow left"
            className="h-6 w-6 -rotate-90 opacity-50"
          />
          <p className="text-md text-gray-500">Back</p>
        </div>
      </Link>

      <h1 className="text-3xl font-extrabold">Settings</h1>

      <dl className="divide-y divide-gray-500">
        <div className={sectionClass}>
          <div className="col-span-2 flex flex-1 flex-col">
            <span className={sectionTitle}>Experimental Features</span>
            <span className={sectionDescription}>
              Experience and test the latest features, but expect bugs
            </span>
          </div>

          <Toggle enabled={experimental} setEnabled={toggleExperimental} />
        </div>

        {experimental && (
          <>
            {experimentalFeatures.map((feature) => (
              <div
                className={sectionClass}
                key={`experimental.feature.${feature.key}`}
              >
                <div className="col-span-2 flex flex-col">
                  <span className={sectionTitle}>{feature.title}</span>
                  <span className={sectionDescription}>
                    {feature.description}
                  </span>
                </div>

                <div className="col-span-2">
                  <Toggle
                    enabled={features.includes(feature)}
                    setEnabled={(v) => toggleFeature(v, feature)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </dl>

      {hasChanges && (
        <div className="flex gap-2">
          <button
            onClick={saveFeatures}
            className={clsx(
              buttonClass,
              "bg-indigo-600 hover:bg-indigo-700  focus:ring-indigo-500"
            )}
          >
            Save
          </button>

          <button
            onClick={resetFeatures}
            className={clsx(
              buttonClass,
              "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
            )}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
