import { useEditor, EditorContent, useEditorState } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomImage } from '../extensions/custom-image';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Image as ImageIcon,
    Quote,
    Undo2,
    Redo2,
    Link as LinkIcon,
    Braces,
    CodeXml,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    TableIcon,
    Table2,
    Trash2,
    WrapText,
} from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function TiptapEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Highlight,
            Link.configure({
                openOnClick: false,
            }),
            CustomImage.configure({
                inline: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Mulai menulis berita...',
            }),
            TaskList,
            TaskItem,
            HorizontalRule,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            isBold: editor.isActive('bold'),
            isItalic: editor.isActive('italic'),
            isUnderline: editor.isActive('underline'),
            isH1: editor.isActive('heading', {
                level: 1,
            }),
            isH2: editor.isActive('heading', {
                level: 2,
            }),
            isH3: editor.isActive('heading', {
                level: 3,
            }),
            isTextAlignLeft: editor.isActive({ textAlign: 'left' }),
            isTextAlignCenter: editor.isActive({ textAlign: 'center' }),
            isTextAlignRight: editor.isActive({ textAlign: 'right' }),
            isTextAlignJustify: editor.isActive({ textAlign: 'justify' }),
            isBulletList: editor.isActive('bulletList'),
            isOrderedList: editor.isActive('orderedList'),
            imageSelected: editor.isActive('image'),
            imageWidth25: editor.isActive('image', { width: '25%' }),
            imageWidth50: editor.isActive('image', { width: '50%' }),
            imageWidth75: editor.isActive('image', { width: '75%' }),
            imageWidth100: editor.isActive('image', { width: '100%' }),
            imageAlignLeft: editor.isActive('image', { align: 'left' }),
            imageAlignCenter: editor.isActive('image', { align: 'center' }),
            imageAlignRight: editor.isActive('image', { align: 'right' }),
            imageTextWrap: editor.isActive('image', { textWrap: true }),
        }),
    });
    const imageAttributes = editor.getAttributes('image');
    const [altText, setAltText] = useState('');

    if (!editor) return null;

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axios.post('/editors/upload-images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        editor
            .chain()
            .focus()
            .setImage({
                src: response.data.url,
            })
            .run();
    };

    const selectImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (!input.files?.length) return;
            await uploadImage(input.files[0]);
        };
        input.click();
    };

    const addLink = () => {
        const url = prompt('Masukkan URL');
        if (!url) return;
        editor
            .chain()
            .focus()
            .setLink({
                href: url,
            })
            .run();
    };

    useEffect(() => {
        if (editor?.isActive('image')) {
            setAltText(editor.getAttributes('image').alt ?? '');
        }
    }, [editorState.imageSelected]);

    return (
        <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="flex flex-wrap divide-x divide-gray-200 border-b p-3">
                <div className="px-2">
                    <h2 className="text-center text-[12px] font-medium text-gray-600">
                        Teks
                    </h2>
                    <div className="mt-2 flex items-center justify-center gap-1">
                        <ButtonToolbar
                            onClick={() => {
                                editor.chain().focus().toggleBold().run();
                            }}
                            isActive={editorState.isBold}
                            icon={<Bold size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor.chain().focus().toggleItalic().run();
                            }}
                            isActive={editorState.isItalic}
                            icon={<Italic size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor.chain().focus().toggleUnderline().run();
                            }}
                            isActive={editorState.isUnderline}
                            icon={<UnderlineIcon size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run();
                            }}
                            isActive={editorState.isH1}
                            icon={<Heading1 size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run();
                            }}
                            isActive={editorState.isH2}
                            icon={<Heading2 size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run();
                            }}
                            isActive={editorState.isH3}
                            icon={<Heading3 size={18} />}
                        />
                    </div>
                </div>
                <div className="px-2">
                    <h2 className="text-center text-[12px] font-medium text-gray-600">
                        Paragraf
                    </h2>
                    <div className="mt-2 flex items-center justify-center gap-1">
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign('left')
                                    .run();
                            }}
                            isActive={editorState.isTextAlignLeft}
                            icon={<AlignLeft size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign('center')
                                    .run();
                            }}
                            isActive={editorState.isTextAlignCenter}
                            icon={<AlignCenter size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign('right')
                                    .run();
                            }}
                            isActive={editorState.isTextAlignRight}
                            icon={<AlignRight size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextAlign('justify')
                                    .run();
                            }}
                            isActive={editorState.isTextAlignJustify}
                            icon={<AlignJustify size={18} />}
                        />
                        <div className="w-[4px]"></div>
                        <ButtonToolbar
                            onClick={() => {
                                editor.chain().focus().toggleBulletList().run();
                            }}
                            isActive={editorState.isBulletList}
                            icon={<List size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleOrderedList()
                                    .run();
                            }}
                            isActive={editorState.isOrderedList}
                            icon={<ListOrdered size={18} />}
                        />
                    </div>
                </div>
                <div className="px-2">
                    <h2 className="text-center text-[12px] font-medium text-gray-600">
                        Sisipan
                    </h2>
                    <div className="mt-2 flex items-center justify-center gap-1">
                        <ButtonToolbar
                            onClick={() =>
                                editor.chain().focus().toggleBlockquote().run()
                            }
                            icon={<Quote size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() =>
                                editor.chain().focus().toggleCode().run()
                            }
                            icon={<Braces size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() =>
                                editor.chain().focus().toggleCodeBlock().run()
                            }
                            icon={<CodeXml size={18} />}
                        />
                        <ButtonToolbar
                            onClick={selectImage}
                            icon={<ImageIcon size={18} />}
                        />
                        <ButtonToolbar
                            onClick={addLink}
                            icon={<LinkIcon size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .insertTable({
                                        rows: 3,
                                        cols: 3,
                                        withHeaderRow: true,
                                    })
                                    .run()
                            }
                            icon={<Table2 size={18} />}
                        />
                    </div>
                </div>
                <div className="px-2">
                    <h2 className="text-center text-[12px] font-medium text-gray-600">
                        Aksi
                    </h2>
                    <div className="mt-2 flex items-center justify-center gap-1">
                        <ButtonToolbar
                            onClick={() => editor.chain().focus().undo().run()}
                            icon={<Undo2 size={18} />}
                        />
                        <ButtonToolbar
                            onClick={() => editor.chain().focus().redo().run()}
                            icon={<Redo2 size={18} />}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 border-b p-3">
                {editorState.imageSelected && (
                    <div className="flex divide-x divide-slate-200">
                        <div className="flex items-center gap-2 px-2">
                            <span className="text-[12px] font-medium text-gray-600">
                                Ukuran
                            </span>
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setImageWidth('25%')
                                        .run()
                                }
                                isActive={editorState.imageWidth25}
                                label="25%"
                            />
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setImageWidth('50%')
                                        .run()
                                }
                                isActive={editorState.imageWidth50}
                                label="50%"
                            />
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setImageWidth('75%')
                                        .run()
                                }
                                isActive={editorState.imageWidth75}
                                label="75%"
                            />
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setImageWidth('100%')
                                        .run()
                                }
                                isActive={editorState.imageWidth100}
                                label="100%"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-2">
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setImageAlign('left')
                                        .run()
                                }
                                isActive={editorState.imageAlignLeft}
                                label="Left"
                            />
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setImageAlign('center')
                                        .run()
                                }
                                isActive={editorState.imageAlignCenter}
                                label="Center"
                            />
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setImageAlign('right')
                                        .run()
                                }
                                isActive={editorState.imageAlignRight}
                                label="Right"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-2">
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextWrap(!editorState.imageTextWrap)
                                        .run()
                                }
                                isActive={editorState.imageTextWrap}
                                icon={<WrapText size={18} />}
                            />
                        </div>
                        <div className="flex items-center gap-2 px-2">
                            <input
                                type="text"
                                placeholder="Alt text..."
                                className="rounded-lg border px-2 py-1 text-[12px] font-medium text-gray-600"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                onBlur={() =>
                                    editor
                                        ?.chain()
                                        .focus()
                                        .updateAttributes('image', {
                                            alt: altText,
                                        })
                                        .run()
                                }
                            />
                            <ButtonToolbar
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .deleteSelection()
                                        .run()
                                }
                                icon={<Trash2 size={18} />}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="h-[800px] overflow-y-auto">
                <EditorContent
                    editor={editor}
                    className="prose prose-lg size-full max-w-none p-10 prose-slate [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_img]:rounded-2xl [&_.ProseMirror_img]:shadow-lg [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_td]:border [&_.ProseMirror_td]:p-2 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:bg-slate-100"
                />
            </div>
        </div>
    );
}

const ButtonToolbar = ({
    onClick,
    icon,
    isActive = false,
    label,
}: {
    onClick: () => void;
    icon?: React.ReactNode;
    isActive?: boolean;
    label?: string;
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`cursor-pointer rounded-md p-1 ${
                isActive
                    ? 'bg-slate-400 text-white'
                    : 'bg-slate-100 text-gray-800 hover:bg-blue-100'
            }`}
        >
            {icon}
            <h1 className="text-[12px] font-medium">{label}</h1>
        </button>
    );
};
