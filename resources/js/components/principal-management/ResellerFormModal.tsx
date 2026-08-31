import { useForm } from '@inertiajs/react';
import { Eye, FileText, FileUp, Upload } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import resellers from '@/routes/principal-management/resellers';
import CustomModal from '../custom-components/CustomModal';

type Reseller = {
    id: number;
    name: string;
    npwp_number: string | null;
    document_number: string | null;
    document_path: string | null;
};

interface Props {
    open: boolean;
    principalId: number;
    editingReseller: Reseller | null;
    onClose: () => void;
}

export default function ResellerFormModal({
    open,
    principalId,
    editingReseller,
    onClose,
}: Props) {
    const form = useForm({
        name: '',
        npwp_number: '',
        document_number: '',
        file: null as File | null,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        form.reset();

        if (editingReseller) {
            form.setData({
                name: editingReseller.name,
                npwp_number: editingReseller.npwp_number ?? '',
                document_number: editingReseller.document_number ?? '',
                file: null,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, editingReseller]);

    const blobUrl = useMemo(
        () => (form.data.file ? URL.createObjectURL(form.data.file) : null),
        [form.data.file],
    );

    useEffect(() => {
        if (!blobUrl) {
            return;
        }

        return () => URL.revokeObjectURL(blobUrl);
    }, [blobUrl]);

    const previewUrl = blobUrl ?? editingReseller?.document_path ?? null;
    const previewName =
        form.data.file?.name ??
        (editingReseller ? 'Lampiran dokumen reseller' : '');

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
                    text: 'Data reseller berhasil disimpan.',
                });
            },
        };

        if (editingReseller) {
            form.post(
                `${resellers.update.url({
                    principal: principalId,
                    reseller: editingReseller.id,
                })}?_method=PUT`,
                options,
            );

            return;
        }

        form.post(resellers.store.url(principalId), options);
    };

    const inputClass =
        'h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none';

    return (
        <CustomModal
            open={open}
            onClose={handleClose}
            title={editingReseller ? 'Ubah Reseller' : 'Tambah Reseller'}
            size="lg"
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-slate-600">
                            Nama Reseller
                            <span className="ml-1 text-red-500">*</span>
                        </label>
                        <input
                            className={inputClass}
                            placeholder="Masukkan nama reseller"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                        {form.errors.name && (
                            <span className="text-xs text-red-500">
                                {form.errors.name}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-600">
                            NPWP
                        </label>
                        <input
                            className={inputClass}
                            placeholder="Masukkan nomor NPWP"
                            value={form.data.npwp_number}
                            onChange={(e) =>
                                form.setData(
                                    'npwp_number',
                                    e.target.value,
                                )
                            }
                        />
                        {form.errors.npwp_number && (
                            <span className="text-xs text-red-500">
                                {form.errors.npwp_number}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-600">
                            Nomor Dokumen
                        </label>
                        <input
                            className={inputClass}
                            placeholder="Masukkan nomor dokumen"
                            value={form.data.document_number}
                            onChange={(e) =>
                                form.setData('document_number', e.target.value)
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-slate-600">
                            File Dokumen
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500 transition hover:border-blue-400 hover:bg-blue-50">
                            <Upload size={16} />
                            {form.data.file
                                ? form.data.file.name
                                : 'Klik untuk memilih file'}
                            <input
                                type="file"
                                onChange={(e) =>
                                    form.setData(
                                        'file',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                                className="hidden"
                            />
                        </label>
                        {previewUrl && (
                            <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-2.5">
                                <FileText
                                    size={16}
                                    className="shrink-0 text-blue-600"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-700">
                                        {previewName}
                                    </p>
                                </div>
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                                >
                                    <Eye size={12} />
                                    Lihat
                                </a>
                            </div>
                        )}
                    </div>
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
                            : editingReseller
                              ? 'Perbarui'
                              : 'Simpan'}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
}
