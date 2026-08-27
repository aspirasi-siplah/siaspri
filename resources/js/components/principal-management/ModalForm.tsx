import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
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
                    <div className="max-h-[60vh] space-y-5 overflow-y-auto">
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormInput
                                name="name"
                                label="Nama Principal"
                                type="text"
                                placeholder="Masukkan nama principal"
                                value={form.data.name}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('name', e.target.value)}
                                error={form.errors.name}
                                required
                            />
                            <FormInput
                                name="npwp_number"
                                label="NPWP"
                                type="text"
                                placeholder="Masukkan nomor NPWP"
                                value={form.data.npwp_number}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('npwp_number', e.target.value)}
                                error={form.errors.npwp_number}
                                info="Opsional"
                            />
                            <FormInput
                                name="nib"
                                label="NIB"
                                type="text"
                                placeholder="Masukkan nomor NIB"
                                value={form.data.nib}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('nib', e.target.value)}
                                error={form.errors.nib}
                                info="Opsional"
                            />
                            <FormTextArea
                                name="notes"
                                label="Catatan"
                                rows={4}
                                placeholder="Masukkan catatan (opsional)"
                                value={form.data.notes}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => form.setData('notes', e.target.value)}
                                error={form.errors.notes}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            Batal
                        </button>
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
