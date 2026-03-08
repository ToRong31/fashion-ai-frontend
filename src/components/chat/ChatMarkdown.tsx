import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useChatStore } from '../../stores/chatStore';

/**
 * Lightweight inline markdown renderer for chat messages.
 * Supports: **bold**, [links](url), `code`, Product ID refs, line breaks.
 */

function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Match **bold**, [text](url), `code`, or Product ID XX
  const pattern = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(`([^`]+)`)|(\*?Product\s*ID\s*(\d+)\*?)/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      nodes.push(
        <strong key={key++} className="font-semibold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      nodes.push(
        <a
          key={key++}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-2 hover:text-gold-light transition-colors break-all"
        >
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      nodes.push(
        <code key={key++} className="bg-white/10 px-1 py-0.5 rounded text-[11px]">
          {match[7]}
        </code>
      );
    } else if (match[8]) {
      const productId = match[9];
      nodes.push(
        <ProductIdLink key={key++} id={productId} />
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function ProductIdLink({ id }: { id: string }) {
  const toggleOpen = useChatStore((s) => s.toggleOpen);
  return (
    <Link
      to={`/products/${id}`}
      onClick={toggleOpen}
      className="text-gold underline underline-offset-2 hover:text-gold-light transition-colors"
    >
      Product #{id}
    </Link>
  );
}

interface ChatMarkdownProps {
  content: string;
}

export default function ChatMarkdown({ content }: ChatMarkdownProps) {
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    // Detect markdown table (header row + separator row)
    if (
      trimmed.startsWith('|') &&
      i + 1 < lines.length &&
      /^\|[\s\-:|]+\|$/.test(lines[i + 1].trim())
    ) {
      const headerCells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
      i += 2; // skip header + separator
      const bodyRows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().split('|').map((c) => c.trim()).filter(Boolean);
        bodyRows.push(cells);
        i++;
      }
      elements.push(
        <div key={`tbl-${i}`} className="overflow-x-auto my-1.5 -mx-1">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr>
                {headerCells.map((h, hi) => (
                  <th key={hi} className="text-left px-1.5 py-1 text-gold/80 font-medium border-b border-border">
                    {parseInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className="border-b border-border/50 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-1.5 py-1 text-text-secondary align-top">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Empty line → small spacer
    if (!trimmed) {
      elements.push(<div key={i} className="h-1" />);
      i++;
      continue;
    }

    // --- horizontal rule
    if (/^-{3,}$/.test(trimmed)) {
      elements.push(<hr key={i} className="border-border/40 my-1.5" />);
      i++;
      continue;
    }

    // Heading-like lines (### or ##)
    if (trimmed.startsWith('### ')) {
      elements.push(
        <p key={i} className="font-semibold text-text-primary text-xs mt-1">
          {parseInline(trimmed.slice(4))}
        </p>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <p key={i} className="font-semibold text-text-primary text-sm mt-1">
          {parseInline(trimmed.slice(3))}
        </p>
      );
      i++;
      continue;
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <p key={i} className="pl-3 before:content-['•'] before:mr-1.5 before:text-gold/60">
          {parseInline(trimmed.slice(2))}
        </p>
      );
      i++;
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)[.)]\s/);
    if (numMatch) {
      elements.push(
        <p key={i} className="pl-3">
          <span className="text-gold/60 mr-1">{numMatch[1]}.</span>
          {parseInline(trimmed.slice(numMatch[0].length))}
        </p>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(<p key={i}>{parseInline(trimmed)}</p>);
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}
