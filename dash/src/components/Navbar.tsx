"use client";

import clsx from "clsx";
import Link from "next/link";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="flex h-8 flex-row items-center gap-2 truncate rounded-md bg-zinc-800">
      <Link href="/" className="h-full">
        <NavItem name="Dashboard" active={pathname === "/"} />
      </Link>

      <Link href="/archive" className="h-full">
        <NavItem name="Archive" active={pathname === "/archive"} />
      </Link>

      {/* <NavItem name="H2H View" active={false} /> */}
      {/* <NavItem name="Team View" active={false} /> */}
      {/* <NavItem name="Graph View" active={false} /> */}
      {/* <NavItem name="Settings" active={false} /> */}

      <Link href="/help" className="h-full">
        <NavItem name="Help?" active={pathname === "/help"} />
      </Link>
    </div>
  );
}

type NavItemProps = {
  name: string;
  active: boolean;
};

const NavItem = ({ name, active }: NavItemProps) => {
  return (
    <div
      className={clsx(
        "flex h-full cursor-pointer flex-col justify-center rounded-md px-3",
        active && "bg-zinc-700"
      )}
    >
      <p className="text-sm font-medium leading-none">{name}</p>
    </div>
  );
};
