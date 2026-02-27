import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import type { Editor } from "@tiptap/react";

interface RichTextEditorProps {
  content: string;
  onUpdate: (html: string) => void;
  onEditorReady?: (editor: Editor) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onUpdate,
  onEditorReady,
  placeholder = "Write your experience here",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "tiptap-bullet-list" },
        },
        orderedList: {
          HTMLAttributes: { class: "tiptap-ordered-list" },
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[60px] focus:outline-none text-lg text-foreground leading-[1.8] prose-none",
      },
    },
  });

  // Expose editor to parent
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Sync content from outside only when editor content differs significantly
  // (e.g., loading a draft). Avoid re-setting on every keystroke.
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
