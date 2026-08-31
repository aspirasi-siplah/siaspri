import { useForm } from '@inertiajs/react';
import { Building2, Check, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import principalManagement from '@/routes/principal-management';
import CustomModal from '../custom-components/CustomModal';
import FormInput from '../custom-components/FormInput';
import FormTextArea from '../custom-components/FormTextArea';

interface Principal {
    id: number;
    name: string;
    notes: string | null;
    npwp_number: string | null;
    nib: string | null;
}

interface Props {
    principal?: Principal;
}

export default function ModalForm({ principal }: Props) {
    const [open, setOpen] = useState(false);
    const isEdit = !!principal;

    const form = useForm({
        name: principal?.name ?? '',
        notes: principal?.notes ?? '',
        npwp_number: principal?.npwp_number ?? '',
        nib: principal?.nib ?? '',
    });

    const handleOpen = () => {
        if (principal) {
            form.setData({
                name: principal.name,
                notes: principal.notes ?? '',
                npwp_number: principal.npwp_number ?? '',
                nib: principal.nib ?? '',
            });
        }

        setOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: isEdit
                        ? 'Principal berhasil diubah.'
                        : 'Principal berhasil disimpan.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: isEdit
                        ? 'Principal gagal diubah.'
                        : 'Principal gagal disimpan.',
                });
            },
        };

        if (isEdit) {
            form.put(principalManagement.update.url(principal!.id), options);

            return;
        }

        form.post(principalManagement.store.url(), options);
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
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                    <Plus size={16} />
                    Tambah Principal
                </button>
            )}

            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title={isEdit ? 'Ubah Principal' : 'Tambah Principal'}
                size="lg"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                        <Building2
                            size={20}
                            className="mt-0.5 shrink-0 text-blue-600"
                        />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {isEdit
                                    ? 'Perbarui informasi principal'
                                    : 'Informasi Principal baru'}
                            </p>
                            <p className="mt-0.5 text-sm text-blue-700/80">
                                {isEdit
                                    ? 'Pastikan data NPWP dan NIB sudah benar sebelum menyimpan perubahan.'
                                    : 'Lengkapi data di bawah ini untuk menambahkan principal baru.'}
                            </p>
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto pr-1">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <FormInput
                                    name="name"
                                    label="Nama Principal"
                                    type="text"
                                    placeholder="Contoh: PT Mitra Sejahtera Abadi"
                                    value={form.data.name}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => form.setData('name', e.target.value)}
                                    error={form.errors.name}
                                    required
                                />
                            </div>
                            <FormInput
                                name="npwp_number"
                                label="NPWP"
                                type="text"
                                placeholder="Contoh: 01.234.567.8-901.000"
                                value={form.data.npwp_number}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    form.setData(
                                        'npwp_number',
                                        e.target.value.replace(/\D/g, ''),
                                    )
                                }
                                error={form.errors.npwp_number}
                                info="Opsional"
                            />
                            <FormInput
                                name="nib"
                                label="NIB"
                                type="text"
                                placeholder="Contoh: 8123456789012"
                                value={form.data.nib}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    form.setData(
                                        'nib',
                                        e.target.value.replace(/\D/g, ''),
                                    )
                                }
                                error={form.errors.nib}
                                info="Opsional"
                            />
                            <div className="md:col-span-2">
                                <FormTextArea
                                    name="notes"
                                    label="Catatan"
                                    rows={4}
                                    placeholder="Tambahkan catatan tambahan mengenai principal ini (opsional)"
                                    value={form.data.notes}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLTextAreaElement>,
                                    ) => form.setData('notes', e.target.value)}
                                    error={form.errors.notes}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {form.processing ? (
                                'Menyimpan...'
                            ) : (
                                <>
                                    <Check size={16} />
                                    {isEdit ? 'Perbarui' : 'Simpan'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </CustomModal>
        </>
    );
}
