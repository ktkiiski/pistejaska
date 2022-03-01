import { useEffect, useState } from "react";
import "github-markdown-css";
import changelogMarkdownUrl from "./CHANGELOG.md";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import ViewContentLayout from "./common/components/ViewContentLayout";
import Markdown from "./common/components/Markdown";

async function loadText(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}

export default function WhatsNewView() {
  const [markdown, setMarkdown] = useState<string | null>(null);
  useEffect(() => {
    // Load the CHANGELOG.md markdown from the asset URI
    loadText(changelogMarkdownUrl).then(setMarkdown);
  }, []);
  if (!markdown) {
    return <LoadingSpinner />;
  }
  return (
    <ViewContentLayout>
      <Markdown className="markdown-body p-4">{markdown}</Markdown>
    </ViewContentLayout>
  );
}
