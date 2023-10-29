import { ReactNode } from "react";

export default function Footer() {
  return (
    <footer className="mt-4 flex flex-wrap gap-2 text-sm font-medium text-gray-200">
      <p>
        Made with ♥ by{" "}
        <TextLink website="https://slowlydev.vercel.app">Slowlydev</TextLink>.
      </p>

      <p>
        Please give me your{" "}
        <TextLink website="https://slowly-improve.vercel.app/f1-dash">
          Feedback
        </TextLink>
        .
      </p>

      <p>
        Contribute on{" "}
        <TextLink website="https://github.com/Slowlydev/f1-dash">
          Github
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
