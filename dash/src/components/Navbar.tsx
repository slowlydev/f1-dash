import clsx from "clsx";

export default function Navbar() {
  return (
    <div className="flex h-8 flex-row items-center gap-2 truncate rounded-md bg-zinc-800">
      <NavItem name="Dashboard" active />

      <NavItem name="Schedule" active={false} />

      <NavItem name="H2H View" active={false} />

      {/* <NavItem name="Team View" active={false} /> */}
      {/* <NavItem name="Graph View" active={false} /> */}

      <NavItem name="Settings" active={false} />

      <NavItem name="Help?" active={false} />
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
