'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback, useState } from 'react';
import { marked } from 'marked';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write your description...', minHeight = 240 }: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'markdown' | 'html'>('visual');
  const [rawSource, setRawSource] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: { HTMLAttributes: { class: 'code-block' } },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link', target: '_blank', rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        style: `min-height: ${minHeight}px`,
      },
    },
  });

  // Sync external value on first load
  useEffect(() => {
    if (editor && value && editor.isEmpty && value !== '<p></p>') {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prevUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', prevUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  // Switch modes
  const switchMode = useCallback((newMode: 'visual' | 'markdown' | 'html') => {
    if (!editor) return;

    if (mode === 'visual' && newMode !== 'visual') {
      // Going from visual to source mode
      setRawSource(newMode === 'html' ? editor.getHTML() : '');
    } else if (mode !== 'visual' && newMode === 'visual') {
      // Coming back to visual from source
      if (mode === 'markdown') {
        const html = marked.parse(rawSource, { async: false }) as string;
        editor.commands.setContent(html);
        onChange(html);
      } else if (mode === 'html') {
        editor.commands.setContent(rawSource);
        onChange(rawSource);
      }
    }
    setMode(newMode);
  }, [editor, mode, rawSource, onChange]);

  if (!editor) return null;

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar">
        {mode === 'visual' && (
          <>
            {/* Text formatting */}
            <div className="rich-editor-group">
              <button type="button" className={`rich-editor-btn${editor.isActive('bold') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('italic') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                <em>I</em>
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('strike') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
                <s>S</s>
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('code') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleCode().run()} title="Inline Code">
                {'<>'}
              </button>
            </div>

            {/* Headings */}
            <div className="rich-editor-group">
              <button type="button" className={`rich-editor-btn${editor.isActive('heading', { level: 2 }) ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
                H2
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('heading', { level: 3 }) ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
                H3
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('heading', { level: 4 }) ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} title="Heading 4">
                H4
              </button>
            </div>

            {/* Lists */}
            <div className="rich-editor-group">
              <button type="button" className={`rich-editor-btn${editor.isActive('bulletList') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
                •
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('orderedList') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
                1.
              </button>
            </div>

            {/* Block elements */}
            <div className="rich-editor-group">
              <button type="button" className={`rich-editor-btn${editor.isActive('link') ? ' active' : ''}`}
                onClick={setLink} title="Link">
                🔗
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('codeBlock') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
                {'{ }'}
              </button>
              <button type="button" className={`rich-editor-btn${editor.isActive('blockquote') ? ' active' : ''}`}
                onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
                ❝
              </button>
              <button type="button" className="rich-editor-btn"
                onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                —
              </button>
            </div>

            {/* Undo / Redo */}
            <div className="rich-editor-group">
              <button type="button" className="rich-editor-btn" onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()} title="Undo">
                ↩
              </button>
              <button type="button" className="rich-editor-btn" onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()} title="Redo">
                ↪
              </button>
            </div>
          </>
        )}

        {/* Mode toggle — always visible */}
        <div className="rich-editor-group rich-editor-mode-toggle">
          <button type="button" className={`rich-editor-btn${mode === 'visual' ? ' active' : ''}`}
            onClick={() => switchMode('visual')} title="Visual Editor">
            ✏️ Visual
          </button>
          <button type="button" className={`rich-editor-btn${mode === 'markdown' ? ' active' : ''}`}
            onClick={() => switchMode('markdown')} title="Write in Markdown">
            📝 Markdown
          </button>
          <button type="button" className={`rich-editor-btn${mode === 'html' ? ' active' : ''}`}
            onClick={() => switchMode('html')} title="Edit raw HTML">
            🔧 HTML
          </button>
        </div>
      </div>

      {mode === 'visual' ? (
        <EditorContent editor={editor} />
      ) : (
        <div className="rich-editor-source-wrap">
          <textarea
            className="rich-editor-source"
            value={rawSource}
            onChange={(e) => setRawSource(e.target.value)}
            placeholder={mode === 'markdown' ? '# Heading\n\nWrite **markdown** here...\n\n- List item\n- Another item\n\n```php\n// Code block\n```' : '<h2>Heading</h2>\n<p>Write HTML here...</p>'}
            style={{ minHeight }}
            spellCheck={false}
          />
          <p className="rich-editor-hint">
            {mode === 'markdown'
              ? '💡 Write in Markdown syntax. Switch back to Visual to preview and continue editing.'
              : '💡 Write raw HTML. Switch back to Visual to preview and continue editing.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
