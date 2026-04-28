import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark-dimmed.css';

interface DocContentProps {
  body: string;
  format?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Detect if a string looks like markdown rather than HTML */
function looksLikeMarkdown(text: string): boolean {
  // If it starts with an HTML tag, it's probably HTML
  if (/^\s*<[a-z][\s\S]*>/i.test(text)) return false;
  // Check for common markdown patterns
  const mdPatterns = [
    /^#{1,6}\s+/m,          // headings
    /\*\*[^*]+\*\*/,         // bold
    /^[-*+]\s+/m,            // unordered lists
    /^\d+\.\s+/m,            // ordered lists
    /^---$/m,                // horizontal rules
    /```[\s\S]*?```/,        // code blocks
    /\[.+?\]\(.+?\)/,        // links
  ];
  const matches = mdPatterns.filter(p => p.test(text)).length;
  return matches >= 2;
}

/**
 * Renders documentation content from Drupal.
 * Uses `react-markdown` for markdown format (with tables, raw HTML, and syntax highlighting),
 * and falls back to HTML injection for Drupal's HTML text formats.
 */
export default function DocContent({ body, format, className, style }: DocContentProps) {
  if (!body) return null;

  const isMarkdown = format === 'markdown' || (!format && looksLikeMarkdown(body));

  if (isMarkdown) {
    return (
      <div className={className} style={style}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], rehypeHighlight]}
        >
          {body}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
