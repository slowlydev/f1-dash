import { ReactNode } from "react";

export default function Footer() {
	return (
		<footer className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-gray-200">
			<p>
				Made with ♥ by <TextLink website="https://slowly.dev">Slowlydev</TextLink>.
			</p>

			<p>
				Please give me your <TextLink website="https://improve.slowly.dev/f1-dash">Feedback</TextLink>.
			</p>

			<p>
				Contribute on <TextLink website="https://github.com/slowlydev/f1-dash">GitHub</TextLink>.
			</p>

			<p>
				<TextLink website="https://www.buymeacoffee.com/slowlydev">Buy me a coffee</TextLink> to support me.
			</p>
		</footer>
	);
}

type TextLinkProps = {
	website: string;
	children: ReactNode;
};

const TextLink = ({ website, children }: TextLinkProps) => {
	return (
		<a className="text-blue-500" target="_blank" href={website}>
			{children}
		</a>
	);
};
