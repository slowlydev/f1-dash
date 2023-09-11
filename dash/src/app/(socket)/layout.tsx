import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function SocketLayout({ children }: Props) {
  return <div>{children}</div>;
}
