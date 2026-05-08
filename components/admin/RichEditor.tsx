"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Typography from "@tiptap/extension-typography";
import { TableKit } from "@tiptap/extension-table";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const lowlight = createLowlight(common);

type Props = {
  initialHtml?: string;
  placeholder?: string;
  onChange?: (html: string, text: string) => void;
};

type OutlineItem = { id: string; level: number; text: string; pos: number };

export default function RichEditor({ initialHtml, placeholder, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [activePos, setActivePos] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: false,
        horizontalRule: { HTMLAttributes: { class: "hr" } },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({ HTMLAttributes: { class: "post-img" } }),
      Typography,
      TableKit.configure({
        table: { resizable: true, HTMLAttributes: { class: "post-table" } },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
        HTMLAttributes: { class: "post-code" },
      }),
    ],
    content: initialHtml ?? "",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML(), editor.getText());
      setOutline(extractOutline(editor));
    },
    onSelectionUpdate({ editor }) {
      setActivePos(currentHeadingPos(editor));
    },
    onCreate({ editor }) {
      setOutline(extractOutline(editor));
    },
  });

  // Push initial state up so PostForm has the right defaultValue on first
  // submit even if the user never types.
  useEffect(() => {
    if (editor) onChange?.(editor.getHTML(), editor.getText());
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const handleLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImageButton = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleImageChosen = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !editor) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file, file.name);
        const res = await fetch("/api/upload/cover", { method: "POST", body: fd });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          window.alert(json?.error || `Upload failed (${res.status}).`);
          return;
        }
        editor.chain().focus().setImage({ src: json.url }).run();
      } finally {
        setUploading(false);
      }
    },
    [editor]
  );

  const handleJump = useCallback(
    (pos: number) => {
      if (!editor) return;
      // Move selection inside the heading and focus, then scroll its DOM into view.
      editor.chain().focus().setTextSelection(pos + 1).run();
      const view = editor.view;
      const dom = view.nodeDOM(pos);
      const el =
        dom instanceof HTMLElement
          ? dom
          : dom?.parentElement instanceof HTMLElement
            ? dom.parentElement
            : null;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [editor]
  );

  if (!editor) {
    return <div className="rich-loading">loading editor…</div>;
  }

  return (
    <div className="rich">
      <Toolbar editor={editor} onLink={handleLink} onImage={handleImageButton} uploading={uploading} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden-file"
        onChange={handleImageChosen}
      />
      <EditorContent editor={editor} className="rich-content" />
      {mounted && typeof document !== "undefined"
        ? createPortal(
            <Outline items={outline} activePos={activePos} onJump={handleJump} />,
            document.body
          )
        : null}
    </div>
  );
}

function extractOutline(editor: Editor): OutlineItem[] {
  const items: OutlineItem[] = [];
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading") {
      const level = (node.attrs as { level?: number }).level ?? 1;
      const text = node.textContent.trim();
      items.push({ id: `h-${pos}`, level, text, pos });
    }
  });
  return items;
}

function currentHeadingPos(editor: Editor): number | null {
  const { from } = editor.state.selection;
  let last: number | null = null;
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "heading" && pos <= from) {
      last = pos;
    }
  });
  return last;
}

function Outline({
  items,
  activePos,
  onJump,
}: {
  items: OutlineItem[];
  activePos: number | null;
  onJump: (pos: number) => void;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activePos]);

  if (items.length === 0) return null;
  return (
    <aside className="rich-outline" aria-label="Document outline">
      <div className="outline-title">Outline</div>
      <ul className="outline-list">
        {items.map((item) => {
          const isActive = item.pos === activePos;
          return (
            <li key={item.id} className={`outline-item lvl-${item.level} ${isActive ? "is-active" : ""}`}>
              <button
                ref={isActive ? activeRef : null}
                type="button"
                className="outline-link"
                onClick={() => onJump(item.pos)}
              >
                {item.text || <em className="outline-placeholder">(empty heading)</em>}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function Toolbar({
  editor,
  onLink,
  onImage,
  uploading,
}: {
  editor: Editor;
  onLink: () => void;
  onImage: () => void;
  uploading: boolean;
}) {
  const btn = (
    label: string,
    cmd: () => void,
    active = false,
    disabled = false,
    title?: string
  ) => (
    <button
      type="button"
      onClick={cmd}
      disabled={disabled}
      className={`tb-btn ${active ? "is-active" : ""}`}
      title={title ?? label}
      aria-label={title ?? label}
    >
      {label}
    </button>
  );

  return (
    <div className="rich-toolbar">
      {btn("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }), false, "Heading 1")}
      {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }), false, "Heading 2")}
      {btn("H3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }), false, "Heading 3")}
      {btn("H4", () => editor.chain().focus().toggleHeading({ level: 4 }).run(), editor.isActive("heading", { level: 4 }), false, "Heading 4")}
      <span className="tb-sep" />
      {btn("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"), false, "Bold")}
      {btn("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"), false, "Italic")}
      {btn("S", () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"), false, "Strikethrough")}
      {btn("‹›", () => editor.chain().focus().toggleCode().run(), editor.isActive("code"), false, "Inline code")}
      {btn("{ }", () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"), false, "Code block")}
      <span className="tb-sep" />
      {btn("“”", () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"), false, "Quote")}
      {btn("•", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"), false, "Bullet list")}
      {btn("1.", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"), false, "Ordered list")}
      {btn("―", () => editor.chain().focus().setHorizontalRule().run(), false, false, "Horizontal rule")}
      <span className="tb-sep" />
      {btn("link", onLink, editor.isActive("link"), false, "Insert / edit link")}
      {btn(uploading ? "…" : "image", onImage, false, uploading, "Insert image")}
      {btn(
        "table",
        () =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run(),
        false,
        false,
        "Insert table"
      )}
      {editor.isActive("table") ? (
        <>
          <span className="tb-sep" />
          {btn("+col", () => editor.chain().focus().addColumnAfter().run(), false, false, "Add column")}
          {btn("−col", () => editor.chain().focus().deleteColumn().run(), false, false, "Delete column")}
          {btn("+row", () => editor.chain().focus().addRowAfter().run(), false, false, "Add row")}
          {btn("−row", () => editor.chain().focus().deleteRow().run(), false, false, "Delete row")}
          {btn("×tbl", () => editor.chain().focus().deleteTable().run(), false, false, "Delete table")}
        </>
      ) : null}
      <span className="tb-spacer" />
      {btn("undo", () => editor.chain().focus().undo().run(), false, !editor.can().undo(), "Undo")}
      {btn("redo", () => editor.chain().focus().redo().run(), false, !editor.can().redo(), "Redo")}
    </div>
  );
}
