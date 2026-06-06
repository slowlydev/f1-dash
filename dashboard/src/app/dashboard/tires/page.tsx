import OutingTable from "@/components/dashboard/OutingTable";

export default function TiresPage() {
	return (
		<div className="flex min-h-full w-full flex-col">
			<div className="flex flex-col gap-1 border-b border-zinc-800 p-4">
				<h1 className="text-2xl font-bold tracking-tight">Tire Outings</h1>
				<p className="text-sm text-zinc-500">Real-time history of tire compounds and outing progression.</p>
			</div>

			<div className="flex-1">
				<OutingTable />
			</div>
		</div>
	);
}
