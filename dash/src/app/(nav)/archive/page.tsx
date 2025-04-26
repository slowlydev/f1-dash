import { redirect } from "next/navigation";

export default function ArchiveRedirectPage() {
	redirect(`/archive/${new Date(Date.now()).getFullYear()}`);
}
