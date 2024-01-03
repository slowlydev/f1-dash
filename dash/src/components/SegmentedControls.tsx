type Props<T> = {
	options: {
		label: string;
		value: T;
	}[];
	onSelect: (val: T) => void;
};

export default function SegmentedControls<T>({ options, onSelect }: Props<T>) {
	return (
		<div className="flex items-center justify-center rounded-lg p-0.5">
			{options.map((option, i) => (
				<>
					<button className="flex flex-[1_0_0] items-center self-stretch rounded-[7px] px-2.5 py-[3px]">
						<p>{option.label}</p>
					</button>
				</>
			))}
		</div>
	);
}
