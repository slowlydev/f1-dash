import { ReactNode } from "react";

export default function Footer() {
  return (
    <footer className="mt-4 flex gap-8 text-sm font-medium text-gray-200">
      <p>
        Made with ♥ by{" "}
        <TextLink website="https://slowlydev.vercel.app">Slowlydev</TextLink>.
      </p>
      <p>
        Please give me your{" "}
        <TextLink website="https://slowly-improve.vercel.app">
          Feedback
        </TextLink>
        .
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
