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

/**
 * Renders documentation content from Drupal.
 * Uses `react-markdown` for markdown format (with tables, raw HTML, and syntax highlighting),
 * and falls back to HTML injection for Drupal's HTML text formats.
 */
export default function DocContent({ body, format, className, style }: DocContentProps) {
  if (!body) return null;

  if (format === 'markdown') {
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
