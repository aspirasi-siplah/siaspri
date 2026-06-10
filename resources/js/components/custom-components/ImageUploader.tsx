import { useState, ChangeEvent } from 'react';
import { Camera } from 'lucide-react';

interface Props {
    title?: string;
    name: string;
    defaultImage?: string;
    onImageChange: (image: any) => void;
}

export default function ImageUploader({ title = 'Gambar', name, defaultImage, onImageChange }: Props) {
    const [preview, setPreview] = useState<string | any>(defaultImage || null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        onImageChange(file);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                {preview ? (
                    <img
                        src={
                            preview instanceof File
                                ? URL.createObjectURL(preview)
                                : preview
                        }
                        className="h-32 w-32 rounded-full border object-cover"
                    />
                ) : (
                    <div className="h-32 w-32 rounded-full bg-gray-200"></div>
                )}

                <label className="absolute right-0 bottom-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow">
                    <Camera size={18} />
                    <input
                        type="file"
                        name={name}
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />
                </label>
            </div>

            <p className="text-sm text-gray-500">Upload {title}</p>
        </div>
    );
}