import type { ReactNode } from "react";

/**
 * Renders article text as React elements. Never uses raw HTML, so imported or machine-translated
 * content cannot inject markup or scripts. Supported: paragraphs, "## " headings, "- " lists.
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const out: ReactNode[] = [];
  blocks.forEach((block, i) => {
    const lines = block.split("\n");
    if (lines.every((l) => /^[-*] /.test(l))) out.push(<ul key={i}>{lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>);
    else if (/^##+ /.test(block) && lines.length === 1) out.push(<h2 key={i}>{block.replace(/^##+ /, "")}</h2>);
    else out.push(<p key={i}>{lines.map((l, j) => j === 0 ? l : [<br key={`b${j}`} />, l])}</p>);
  });
  return <>{out}</>;
}
