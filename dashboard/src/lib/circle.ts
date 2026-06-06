export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
}

export function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
	const start = polarToCartesian(x, y, radius, endAngle);
	const end = polarToCartesian(x, y, radius, startAngle);

	const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

	return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

export function clamping(value: number, minOut: number, maxOut: number, maxIn: number): number {
	const percTemp = value / maxIn;
	return minOut * (1 - percTemp) + maxOut * percTemp;
}
