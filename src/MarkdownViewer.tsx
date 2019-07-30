import React from "react";
import "github-markdown-css";

const webpackRequireContext = require.context(
  "!markdown-with-front-matter-loader!../",
  false,
  /.MD$/
);

const markdownFiles = webpackRequireContext
  .keys()
  .reduce(
    (memo: any, fileName: any) =>
      memo.set(
        fileName.match(/.\/([^.]+).*/)[1],
        webpackRequireContext(fileName)
      ),
    new Map()
  );

const markdownWrapper = (fileName: string) => (
  <div style={{ textAlign: "left", paddingLeft: "1em", paddingRight: "1em" }}>
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{
        __html: markdownFiles.get(fileName).__content
      }}
    />
  </div>
);

export const MarkdownViewer = (props: { fileName: string }) => {
  return <div>{markdownWrapper(props.fileName || "CHANGELOG")}</div>;
};
