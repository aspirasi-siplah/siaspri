import { ChangeEvent } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

interface ExistingNewsDocument {
    id: number;
    name: string;
    file_name: string;
    file_path: string;
    url: string;
}

interface NewDocument {
    name: string;
    file: File;
    preview: string;
}

interface Props {
    existingDocuments?: ExistingNewsDocument[];
    documents: NewDocument[];
    deletedDocumentIds: number[];
    onDocumentsChange: (documents: NewDocument[]) => void;
    onDeletedDocumentsChange: (ids: number[]) => void;
}

export default function NewsGalleryUpload({
    existingDocuments = [],
    documents,
    deletedDocumentIds,
    onDocumentsChange,
    onDeletedDocumentsChange,
}: Props) {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const mapped = files.map((file) => ({
            name: '',
            file,
            preview: URL.createObjectURL(file),
        }));
        onDocumentsChange([...documents, ...mapped]);
    };

    const removeNewImage = (index: number) => {
        const image = documents[index];
        URL.revokeObjectURL(image.preview);
        onDocumentsChange(documents.filter((_, i) => i !== index));
    };

    const removeExistingImage = (id: number) => {
        onDeletedDocumentsChange([...deletedDocumentIds, id]);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Galeri Foto
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition hover:bg-muted/50">
                    <ImagePlus className="mb-3" size={40} />
                    <span>Pilih Foto</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                        JPG, PNG, WEBP
                    </span>
                    <input
                        hidden
                        multiple
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            </div>
            {existingDocuments.filter(
                (doc) => !deletedDocumentIds.includes(doc.id),
            ).length > 0 && (
                <div>
                    <h4 className="mb-4 font-medium">Foto Tersimpan</h4>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {existingDocuments
                            .filter(
                                (doc) => !deletedDocumentIds.includes(doc.id),
                            )
                            .map((doc) => (
                                <div
                                    key={doc.id}
                                    className="relative overflow-hidden rounded-xl border"
                                >
                                    <img
                                        src={doc.file_path}
                                        alt={doc.name}
                                        className="h-40 w-full object-cover"
                                    />
                                    <p className="text-xs font-medium text-muted-foreground">
                                        {doc.file_name}
                                    </p>
                                    <div className="p-3">
                                        <input
                                            type="text"
                                            value={doc.name}
                                            placeholder="Nama Foto"
                                            readOnly
                                            className="w-full rounded-lg border p-2 text-sm"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeExistingImage(doc.id)
                                        }
                                        className="absolute top-2 right-2 cursor-pointer rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {documents.length > 0 && (
                <div>
                    <h4 className="mb-4 font-medium">Foto Baru</h4>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {documents.map((image, index) => (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-xl border"
                            >
                                <img
                                    src={image.preview}
                                    alt=""
                                    className="h-40 w-full object-cover"
                                />
                                <p className="text-xs font-medium text-muted-foreground">
                                    {image.file.name}
                                </p>
                                <div className="p-3">
                                    <label
                                        htmlFor={`imgGallery-${index}`}
                                        className="text-xs font-medium text-gray-600"
                                    >
                                        Nama Foto
                                        <span className="text-sm text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <input
                                        id={`imgGallery-${index}`}
                                        name={`imgGallery[${index}]`}
                                        type="text"
                                        value={image.name}
                                        placeholder="Nama Foto"
                                        className="w-full rounded-lg border p-2 text-sm"
                                        onChange={(e) => {
                                            const updated = [...documents];

                                            updated[index] = {
                                                ...updated[index],
                                                name: e.target.value,
                                            };

                                            onDocumentsChange(updated);
                                        }}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="absolute top-2 right-2 cursor-pointer rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
