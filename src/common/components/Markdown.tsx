import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
  className?: string;
}

const remarkPlugings = [remarkGfm];

/**
 * Use this component to render a markdown string (safely) as HTML.
 */
export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugings}
      linkTarget="_blank"
      className={className}
    >
      {children}
    </ReactMarkdown>
  );
}
