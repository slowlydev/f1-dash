"use client";

import { ReactNode, useEffect, useState } from "react";
import { SocketProvider, useSocket } from "../../context/SocketContext";
import SessionInfo from "../../components/SessionInfo";

import { env } from "../../env.mjs";
import { State } from "../../types/state.type";
import Navbar from "../../components/Navbar";
import TrackStatus from "../../components/TrackStatus";

type Timeout = NodeJS.Timeout;

type Props = {
  children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
  return (
    <SocketProvider>
      <SubLayout>{children}</SubLayout>
    </SocketProvider>
  );
}

const SubLayout = ({ children }: Props) => {
  const { state, setState, setConnected, delay } = useSocket();

  const [timeouts, setTimeouts] = useState<Timeout[]>([]);

  useEffect(() => {
    timeouts.map(clearTimeout);
    setTimeouts([]);

    const socket = new WebSocket(`${env.NEXT_PUBLIC_SOCKET_SERVER_URL}`);

    socket.onclose = () => setConnected(false);
    socket.onopen = () => setConnected(true);

    socket.onmessage = (event) => {
      const data: State = JSON.parse(event.data);

      if (Object.keys(data).length === 0) return;

      if (delay > 0) {
        const newTimeout = setTimeout(() => setState(data), delay * 1000);
        setTimeouts((otherTimeouts) => [...otherTimeouts, newTimeout]);
      } else {
        setState(data);
      }
    };

    return () => socket.close();
  }, [delay]);

  return (
    <div className="w-full">
      <div className="flex flex-row gap-2">
        <SessionInfo
          session={state?.session}
          clock={state?.extrapolatedClock}
        />

        <div className="flex items-center gap-2">
          <Navbar />
          <TrackStatus track={state?.trackStatus} />
        </div>
      </div>

      {children}
    </div>
  );
};
