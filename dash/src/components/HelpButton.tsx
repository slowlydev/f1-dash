import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import helpIcon from "../../public/icons/help-circle.svg";

type Props = {
  defaultHidden: boolean;
};

export default function HelpButton({ defaultHidden }: Props) {
  return (
    <Link
      href="/help"
      className={clsx(
        defaultHidden ? "hidden sm:block" : "block sm:hidden",
        "cursor-pointer"
      )}
    >
      <Image src={helpIcon} alt="help" className="mr-1 opacity-40" />
    </Link>
  );
}
