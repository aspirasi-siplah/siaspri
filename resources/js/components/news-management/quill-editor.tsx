import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function QuillEditor({ value, onChange }: Props) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }],
            [{ list: 'bullet' }],
            ['blockquote'],
            ['link'],
            ['clean'],
        ],
    };

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            className="min-h-full"
        />
    );
}