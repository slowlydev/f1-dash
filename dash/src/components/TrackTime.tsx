"use client";

import { useEffect, useState, useRef } from "react";
import moment from "moment-timezone";
import { useDataStore } from "@/stores/useDataStore";

// A simple map for common F1 country codes to their typical timezones
// This is not exhaustive and might need to be updated for specific events or future seasons.
const countryTimezoneMap: { [key: string]: string } = {
    "AUS": "Australia/Melbourne", // Australian Grand Prix
    "AUT": "Europe/Vienna",     // Austrian Grand Prix
    "AZE": "Asia/Baku",         // Azerbaijan Grand Prix
    "BHR": "Asia/Bahrain",      // Bahrain Grand Prix
    "BEL": "Europe/Brussels",   // Belgian Grand Prix
    "BRA": "America/Sao_Paulo", // Brazilian Grand Prix
    "CAN": "America/Toronto",   // Canadian Grand Prix
    "CHN": "Asia/Shanghai",     // Chinese Grand Prix
    "COL": "America/Bogota",    // Colombian Grand Prix (example, if it were to be added)
    "DEN": "Europe/Copenhagen", // Danish Grand Prix (example)
    "ESP": "Europe/Madrid",     // Spanish Grand Prix
    "FRA": "Europe/Paris",      // French Grand Prix
    "GBR": "Europe/London",     // British Grand Prix
    "GER": "Europe/Berlin",     // German Grand Prix (example)
    "HUN": "Europe/Budapest",   // Hungarian Grand Prix
    "ITA": "Europe/Rome",       // Italian Grand Prix
    "JPN": "Asia/Tokyo",        // Japanese Grand Prix
    "KSA": "Asia/Riyadh",       // Saudi Arabian Grand Prix
    "MEX": "America/Mexico_City", // Mexican Grand Prix
    "MON": "Europe/Monaco",     // Monaco Grand Prix
    "NED": "Europe/Amsterdam",  // Dutch Grand Prix
    "QAT": "Asia/Qatar",        // Qatar Grand Prix
    "SGP": "Asia/Singapore",    // Singapore Grand Prix
    "UAE": "Asia/Dubai",        // Abu Dhabi Grand Prix
    "USA": "America/New_York",  // United States Grand Prix (could be different for Austin/Miami/Vegas)
};

export default function TrackTime() {
    const sessionInfo = useDataStore((state) => state.sessionInfo);
    const [time, setTime] = useState<string>("--:--:--");
    const [mounted, setMounted] = useState(false);

    const resolvedTimezone = sessionInfo?.timeZone || countryTimezoneMap[sessionInfo?.meeting?.country?.code || ""] || "UTC";

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return; // Only run on client after mount

        if (!resolvedTimezone || !moment.tz.zone(resolvedTimezone)) {
            console.warn("Invalid or missing timezone:", resolvedTimezone);
            return;
        }

        const updateTime = () => {
            const now = moment().tz(resolvedTimezone).format("HH:mm:ss");
            setTime(now);
        };

        updateTime(); // set immediately
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [resolvedTimezone, mounted]);

    if (!resolvedTimezone || !mounted) return null; // Render null on server or until mounted

    return (
        <div className="flex flex-col items-center gap-1 font-mono text-lg">
            <p className="text-sm text-zinc-500">Track Time</p>
            <span>{time}</span>
        </div>
    );
}
