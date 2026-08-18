import { useForm } from '@inertiajs/react';
import { Pencil, Plus, Upload, X } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { statusOptions } from '@/lib/reference-documents';
import type { ReferenceDocument } from '@/lib/reference-documents';
import CustomModal from '../custom-components/CustomModal';
import FormInput from '../custom-components/FormInput';
import FormSelect from '../custom-components/FormSelect';

interface Props {
    document?: ReferenceDocument;
}

export default function ModalForm({ document }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const isEdit = !!document;

    const form = useForm({
        principal_name: document?.principal_name ?? '',
        company_name: document?.company_name ?? '',
        document_number: document?.document_number ?? '',
        program_name: document?.program_name ?? '',
        category_name: document?.category_name ?? '',
        file: null as File | null,
        status: document?.status ?? 'active',
        expired_date: document?.expired_date ?? '',
    });

    const handleOpen = () => {
        if (document) {
            form.setData({
                principal_name: document.principal_name,
                company_name: document.company_name,
                document_number: document.document_number,
                program_name: document.program_name ?? '',
                category_name: document.category_name ?? '',
                file: null,
                status: document.status,
                expired_date: document.expired_date ?? '',
            });
        }

        setSelectedFile(null);
        setOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
        form.setData('file', file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        form.setData('file', null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
                setSelectedFile(null);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: isEdit
                        ? 'Reference Document berhasil diubah.'
                        : 'Reference Document berhasil disimpan.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: isEdit
                        ? 'Reference Document gagal diubah.'
                        : 'Reference Document gagal disimpan.',
                });
            },
        };

        if (isEdit) {
            form.post(`reference-documents-management/${document?.id}?_method=PUT`, {
                ...options,
                forceFormData: true,
            });

            return;
        }

        form.post('reference-documents-management', {
            ...options,
            forceFormData: true,
        });
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
                    Tambah Reference Document
                </button>
            )}

            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title={
                    isEdit
                        ? 'Ubah Reference Document'
                        : 'Tambah Reference Document'
                }
                size="lg"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="max-h-[50vh] space-y-6 overflow-y-auto">
                        <div className="grid gap-6 md:grid-cols-2">
                            {isEdit && (
                                <FormInput
                                    name="reference_id"
                                    label="Reference ID"
                                    type="text"
                                    value={document?.reference_id ?? ''}
                                    disabled
                                    readOnly
                                />
                            )}
                            <FormInput
                                name="principal_name"
                                label="Nama Principal"
                                type="text"
                                value={form.data.principal_name}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('principal_name', e.target.value)}
                                error={form.errors.principal_name}
                                required
                            />
                            <FormInput
                                name="company_name"
                                label="Nama Perusahaan Toko"
                                type="text"
                                value={form.data.company_name}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('company_name', e.target.value)}
                                error={form.errors.company_name}
                                required
                            />
                            <FormInput
                                name="document_number"
                                label="Nomor Dokumen"
                                type="text"
                                value={form.data.document_number}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    form.setData('document_number', e.target.value)
                                }
                                error={form.errors.document_number}
                                required
                            />
                            <FormInput
                                name="program_name"
                                label="Nama Program"
                                type="text"
                                value={form.data.program_name ?? ''}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('program_name', e.target.value)}
                                error={form.errors.program_name}
                                info="Opsional"
                            />
                            <FormInput
                                name="category_name"
                                label="Nama Kategori"
                                type="text"
                                value={form.data.category_name ?? ''}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('category_name', e.target.value)}
                                error={form.errors.category_name}
                                info="Opsional"
                            />
                            <FormSelect
                                name="status"
                                label="Status"
                                options={statusOptions}
                                value={form.data.status}
                                onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>,
                                ) =>
                                    form.setData(
                                        'status',
                                        e.target
                                            .value as ReferenceDocument['status'],
                                    )
                                }
                                error={form.errors.status}
                                required
                            />
                            <FormInput
                                name="expired_date"
                                label="Tanggal Kedaluwarsa"
                                type="date"
                                value={form.data.expired_date ?? ''}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('expired_date', e.target.value)}
                                error={form.errors.expired_date}
                                info="Opsional"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-600">
                                File Dokumen{' '}
                                <span className="text-xs text-gray-400">
                                    (Opsional)
                                </span>
                            </label>
                            {selectedFile || document?.file_name ? (
                                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                                    <Upload size={16} className="text-gray-400" />
                                    <span className="flex-1 truncate text-sm text-gray-700">
                                        {selectedFile?.name ?? document?.file_name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="cursor-pointer text-gray-400 hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                                    <Upload
                                        size={18}
                                        className="mx-auto text-gray-400"
                                    />
                                    <span className="text-sm text-gray-500 w-full">
                                        Klik untuk memilih file (PDF, JPG, PNG, DOC)
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {form.errors.file && (
                                <span className="text-xs text-red-500">
                                    {form.errors.file}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white disabled:opacity-50"
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
