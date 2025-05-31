import { redirect } from "next/navigation";

export default function ArchiveRedirectPage() {
	const currentYear = new Date().getFullYear();
	redirect(`/archive/${currentYear}`);
}
