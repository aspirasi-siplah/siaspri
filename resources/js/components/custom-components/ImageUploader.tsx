import { useState, ChangeEvent } from 'react';
import { Camera, Image } from 'lucide-react';

interface Props {
    title?: string;
    name: string;
    defaultImage?: string | null;
    onImageChange: (image: any) => void;
    info?: string;
    error?: string;
}

export default function ImageUploader({ title = 'Gambar', name, defaultImage, onImageChange, info, error }: Props) {
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
                        className="h-32 w-32 rounded-lg border object-cover"
                    />
                ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gray-200">
                        <Image
                            size={32}
                            strokeWidth={1.5}
                            className="text-gray-300"
                        />
                    </div>
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
            <p className="text-sm text-gray-600">Upload {title}</p>
            <div className="max-w-2/3">
                {error ? (
                    <p className="text-center text-xs text-red-500">{error}</p>
                ) : (
                    info && (
                        <p className="text-center text-xs text-gray-400">
                            {info}
                        </p>
                    )
                )}
            </div>
        </div>
    );
}