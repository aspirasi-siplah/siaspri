import { useForm } from '@inertiajs/react';
import { Eye, FileText, Pencil, Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import CustomModal from '@/components/custom-components/CustomModal';

interface TemplateDocument {
    id: string;
    label: string;
    file_name: string;
    file_path: string;
    view_url: string | null;
    created_at: string;
    updated_at: string;
}

interface LabelOption {
    value: string;
    label: string;
}

interface Props {
    document?: TemplateDocument;
    labelOptions: LabelOption[];
}

export default function ModalForm({ document, labelOptions }: Props) {
    const [open, setOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        document?.view_url ?? null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const objectUrlRef = useRef<string | null>(null);
    const isEdit = !!document;

    const form = useForm({
        label: document?.label ?? '',
        file: null as File | null,
    });

    const revokeObjectUrl = () => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
    };

    const resetPreview = () => {
        revokeObjectUrl();
        setPreviewUrl(isEdit ? (document?.view_url ?? null) : null);
    };

    const handleOpen = () => {
        if (document) {
            form.setData({
                label: document.label,
                file: null,
            });
        } else {
            form.reset();
        }

        resetPreview();
        setOpen(true);
    };

    const closeModal = () => {
        resetPreview();
        setOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        form.setData('file', file);

        revokeObjectUrl();

        if (file) {
            const url = URL.createObjectURL(file);
            objectUrlRef.current = url;
            setPreviewUrl(url);
        } else {
            setPreviewUrl(isEdit ? (document?.view_url ?? null) : null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                form.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: isEdit
                        ? 'Template dokumen berhasil diperbarui.'
                        : 'Template dokumen berhasil ditambahkan.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: isEdit
                        ? 'Template dokumen gagal diperbarui.'
                        : 'Template dokumen gagal ditambahkan.',
                });
            },
        };

        if (isEdit) {
            form.post(
                `template-documents-management/${document?.id}?_method=PUT`,
                options,
            );

            return;
        }

        form.post('template-documents-management', options);
    };

    return (
        <>
            {isEdit ? (
                <button
                    onClick={handleOpen}
                    className="cursor-pointer rounded-lg border p-2 hover:bg-gray-100"
                >
                    <Pencil size={16} />
                </button>
            ) : (
                <button
                    onClick={handleOpen}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm text-primary-foreground hover:bg-blue-600"
                >
                    <Plus size={16} />
                    Tambah Template
                </button>
            )}

            <CustomModal
                open={open}
                onClose={closeModal}
                title={
                    isEdit ? 'Ubah Template Dokumen' : 'Tambah Template Dokumen'
                }
                size="md"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex w-full flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                            Label <span className="text-[13px] text-red-500">*</span>
                        </label>
                        <select
                            name="label"
                            value={form.data.label}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>,
                            ) => form.setData('label', e.target.value)}
                            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="" disabled>
                                Pilih label dokumen
                            </option>
                            {labelOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {form.errors.label && (
                            <span className="text-xs text-red-500">
                                {form.errors.label}
                            </span>
                        )}
                    </div>

                    <div className="flex w-full flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                            File{' '}
                            {!isEdit && (
                                <span className="text-[13px] text-red-500">*</span>
                            )}
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-11 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 transition hover:border-blue-400"
                        >
                            <FileText
                                size={16}
                                className="shrink-0 text-gray-400"
                            />
                            <span className="truncate text-sm text-gray-500">
                                {form.data.file
                                    ? form.data.file.name
                                    : document
                                      ? document.file_name
                                      : 'Pilih file untuk diupload'}
                            </span>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <span className="text-xs text-gray-500">
                            Format: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP,
                            RAR. Maks 10MB.
                        </span>
                        {previewUrl && (
                            <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-blue-600 transition hover:bg-blue-50"
                            >
                                <Eye size={15} />
                                Lihat Dokumen
                            </a>
                        )}
                        {form.errors.file && (
                            <span className="text-xs text-red-500">
                                {form.errors.file}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={closeModal}
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-500 px-4 py-2 text-sm text-primary-foreground hover:bg-gray-600"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm text-primary-foreground hover:bg-blue-600 disabled:opacity-50"
                        >
                            {form.processing
                                ? 'Menyimpan...'
                                : isEdit
                                  ? 'Perbarui'
                                  : 'Simpan'}
                        </button>
                    </div>
                </form>
            </CustomModal>
        </>
    );
}
