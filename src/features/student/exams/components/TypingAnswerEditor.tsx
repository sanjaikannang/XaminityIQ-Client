import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react";

interface TypingAnswerEditorProps {
    initialValue?: string;
    onChange: (html: string) => void;
    disabled?: boolean;
}

const DEBOUNCE_MS = 800;

// Mounted with key={question._id} by the caller so each question gets a
// fresh editor instance seeded from its own saved answerText — avoids
// needing to manually resync Tiptap's internal doc on question navigation.
const TypingAnswerEditor = ({ initialValue, onChange, disabled }: TypingAnswerEditorProps) => {
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialValue || '',
        editable: !disabled,
        onUpdate: ({ editor }) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                onChange(editor.getHTML());
            }, DEBOUNCE_MS);
        },
    });

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    if (!editor) return null;

    const toolbarBtn = (active: boolean) =>
        `p-1.5 rounded cursor-pointer hover:bg-bgSecondary ${active ? 'bg-primary/10 text-primary' : 'text-textSecondary'}`;

    return (
        <div className="rounded-lg border border-borderLight overflow-hidden">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-bgSecondary border-b border-borderLight">
                <button type="button" className={toolbarBtn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
                    <Bold size={14} />
                </button>
                <button type="button" className={toolbarBtn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                    <Italic size={14} />
                </button>
                <button type="button" className={toolbarBtn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
                    <List size={14} />
                </button>
                <button type="button" className={toolbarBtn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
                    <ListOrdered size={14} />
                </button>
                <span className="w-px h-4 bg-borderLight mx-1" />
                <button type="button" className={toolbarBtn(false)} onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo size={14} />
                </button>
                <button type="button" className={toolbarBtn(false)} onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo size={14} />
                </button>
            </div>
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none px-4 py-3 min-h-[180px] max-h-[400px] overflow-y-auto focus:outline-none [&_.ProseMirror]:outline-none"
            />
        </div>
    );
};

export default TypingAnswerEditor;
