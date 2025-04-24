interface CountryFlagProps {
	country: string;
	className?: string;
}

const countryCodeMap: Record<string, string> = {
	"United States": "us",
	Japan: "jp",
	Bahrain: "bh",
	"Saudi Arabia": "sa",
	Italy: "it",
	Monaco: "mc",
	Australia: "au",
	Azerbaijan: "az",
	Canada: "ca",
	China: "cn",
	Austria: "at",
	"United Kingdom": "gb",
	Hungary: "hu",
	Belgium: "be",
	Netherlands: "nl",
	Singapore: "sg",
	Mexico: "mx",
	Brazil: "br",
	Qatar: "qa",
	"United Arab Emirates": "ae",
	Spain: "es",
	// Add any other countries here
};

export function CountryFlag({ country, className = "" }: CountryFlagProps) {
	const countryCode = countryCodeMap[country] || "";

	if (!countryCode) return null;

	return (
		<span className={`mr-2 inline-block ${className}`}>
			<img
				src={`https://flagcdn.com/24x18/${countryCode}.png`}
				srcSet={`https://flagcdn.com/48x36/${countryCode}.png 2x, https://flagcdn.com/72x54/${countryCode}.png 3x`}
				width="24"
				height="18"
				alt={`${country} flag`}
				className="inline-block align-middle"
			/>
		</span>
	);
}
