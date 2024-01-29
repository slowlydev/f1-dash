type Props = {
	values: number[];
	lines?: number;
};

export default function Graph({ lines = 19, values }: Props) {
	const height = 45;
	const width = lines * 6 - 5; // 6 would be a full, but the last line would be cut

	const maxValue = Math.max(...values);
	const minValue = Math.min(...values);

	const scaleValue = (v: number): number => {
		return height - (v / maxValue) * height;
	};

	return (
		<div>
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
			>
				{Array(lines)
					.fill(null)
					.map((_, i) => (
						<>
							{i % 6 ? (
								<rect x={i * 6} width="1" height={height - 10} fill="#403F40" key={`short.${i}`} />
							) : (
								<rect x={i * 6} width="1" height={height} fill="#403F40" key={`long.${i}`} />
							)}
						</>
					))}

				<g clip-path="url(#gradient-clip)">
					<path
						d={`M0 ${scaleValue(values[0])} ${values.map((v, i) => `L${i * 6} ${scaleValue(v)}`).join(" ")} L${width} ${height} L1 ${height}Z`}
						fill="url(#green-gradient)"
					/>
					<path
						d={`M0 ${scaleValue(values[0])} ${values.map((v, i) => `L${i * 6} ${scaleValue(v)}`).join(" ")} L${width} ${height}`}
						stroke="#34C85A"
						strokeWidth="1.5"
					/>
				</g>

				<defs>
					<linearGradient
						id="green-gradient"
						gradientUnits="userSpaceOnUse"
						x1={width / 2}
						y1={0}
						x2={width / 2}
						y2={height}
					>
						<stop offset={0} stopColor="#34C85A" stopOpacity="0.5" />
						<stop offset={1} stopColor="#34C85A" stopOpacity="0" />
					</linearGradient>

					<clipPath id="gradient-clip">
						<rect width={width} height={height - 10} fill="white" />
					</clipPath>
				</defs>
			</svg>
		</div>
	);
}
