import { useForm } from '@inertiajs/react';
import { FileText, FileUp, Upload } from 'lucide-react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import documents from '@/routes/principal-management/documents';
import CustomModal from '../custom-components/CustomModal';

type DocumentType = {
    value: string;
    label: string;
};

type PrincipalDocument = {
    id: number;
    name: {
        value: string;
        label: string;
    };
    path: string;
};

interface Props {
    open: boolean;
    principalId: number;
    documentTypes: DocumentType[];
    editingDocument: PrincipalDocument | null;
    onClose: () => void;
}

export default function DocumentFormModal({
    open,
    principalId,
    documentTypes,
    editingDocument,
    onClose,
}: Props) {
    const form = useForm({
        name: 'STATEMENT_LETTER',
        file: null as File | null,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        form.reset();

        if (editingDocument) {
            form.setData({
                name: editingDocument.name.value,
                file: null,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editingDocument]);

    const handleClose = () => {
        onClose();
        form.reset();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Dokumen berhasil disimpan.',
                });
            },
        };

        if (editingDocument) {
            form.post(
                `${documents.update.url({
                    principal: principalId,
                    document: editingDocument.id,
                })}?_method=PUT`,
                options,
            );

            return;
        }

        form.post(documents.store.url(principalId), options);
    };

    return (
        <CustomModal
            open={open}
            onClose={handleClose}
            title={editingDocument ? 'Ubah Dokumen' : 'Tambah Dokumen'}
            size="lg"
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-600">
                        Jenis Dokumen
                        <span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                        className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                    >
                        {documentTypes.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                    {form.errors.name && (
                        <span className="text-xs text-red-500">
                            {form.errors.name}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="document-file"
                        className="text-sm font-medium text-slate-600"
                    >
                        File Dokumen
                        {!editingDocument && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>
                    <label
                        htmlFor="document-file"
                        className={`group relative flex min-h-[76px] cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all ${
                            form.data.file
                                ? 'border-blue-200 bg-blue-50/30'
                                : 'border-dashed border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                    >
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                form.data.file
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                            }`}
                        >
                            {form.data.file ? (
                                <FileText size={20} />
                            ) : (
                                <Upload size={20} />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            {form.data.file ? (
                                <>
                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {form.data.file.name}
                                    </p>
                                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                        <span>
                                            {(
                                                form.data.file.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{' '}
                                            MB
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                        <span className="text-emerald-600">
                                            File siap diunggah
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-slate-700">
                                        Pilih file dokumen
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Klik untuk memilih file dari perangkat
                                        Anda
                                    </p>
                                </>
                            )}
                        </div>
                        <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors group-hover:border-blue-200 group-hover:text-blue-600">
                            {form.data.file ? 'Ganti' : 'Pilih File'}
                        </span>
                        <input
                            id="document-file"
                            type="file"
                            required={!editingDocument}
                            onChange={(e) =>
                                form.setData(
                                    'file',
                                    e.target.files?.[0] ?? null,
                                )
                            }
                            className="sr-only"
                        />
                    </label>
                    {editingDocument && !form.data.file && (
                        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                            <FileText size={14} className="shrink-0" />
                            <span>
                                Dokumen saat ini tetap digunakan jika tidak
                                memilih file baru.
                            </span>
                        </div>
                    )}
                    {form.errors.file && (
                        <span className="text-xs font-medium text-red-500">
                            {form.errors.file}
                        </span>
                    )}
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        <FileUp size={16} />
                        {form.processing
                            ? 'Menyimpan...'
                            : editingDocument
                              ? 'Perbarui'
                              : 'Simpan'}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
}