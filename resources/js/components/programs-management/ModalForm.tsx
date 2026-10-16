import { useForm } from '@inertiajs/react';
import { Check, FileBadge, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import programsManagement from '@/routes/programs-management';
import CustomModal from '../custom-components/CustomModal';
import FormInput from '../custom-components/FormInput';

interface Program {
    id: number;
    code: string;
    name: string;
    year: number;
    id_fund: string | null;
}

interface Props {
    program?: Program;
}

export default function ModalForm({ program }: Props) {
    const [open, setOpen] = useState(false);
    const isEdit = !!program;

    const form = useForm({
        code: program?.code ?? '',
        name: program?.name ?? '',
        year: program?.year ? String(program.year) : '',
        id_fund: program?.id_fund ?? '',
    });

    const handleOpen = () => {
        if (program) {
            form.setData({
                code: program.code,
                name: program.name,
                year: String(program.year),
                id_fund: program.id_fund ?? '',
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
                        ? 'Program berhasil diubah.'
                        : 'Program berhasil disimpan.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: isEdit
                        ? 'Program gagal diubah.'
                        : 'Program gagal disimpan.',
                });
            },
        };

        if (isEdit) {
            form.put(programsManagement.update.url(program!.id), options);

            return;
        }

        form.post(programsManagement.store.url(), options);
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
                    Tambah Program
                </button>
            )}

            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title={isEdit ? 'Ubah Program' : 'Tambah Program'}
                size="lg"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                        <FileBadge
                            size={20}
                            className="mt-0.5 shrink-0 text-blue-600"
                        />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {isEdit
                                    ? 'Perbarui informasi program'
                                    : 'Informasi Program baru'}
                            </p>
                            <p className="mt-0.5 text-sm text-blue-700/80">
                                {isEdit
                                    ? 'Pastikan kode dan tahun program sudah benar sebelum menyimpan perubahan.'
                                    : 'Lengkapi data di bawah ini untuk menambahkan program baru.'}
                            </p>
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto pr-1">
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormInput
                                name="code"
                                label="Kode Program"
                                type="text"
                                placeholder="Contoh: PRG-2026-001"
                                value={form.data.code}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('code', e.target.value)}
                                error={form.errors.code}
                            />
                            <FormInput
                                name="year"
                                label="Tahun"
                                type="number"
                                placeholder="Contoh: 2026"
                                value={form.data.year}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => form.setData('year', e.target.value)}
                                error={form.errors.year}
                            />
                            <div className="md:col-span-2">
                                <FormInput
                                    name="name"
                                    label="Nama Program"
                                    type="text"
                                    placeholder="Contoh: Program Bantuan Pemerintah"
                                    value={form.data.name}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => form.setData('name', e.target.value)}
                                    error={form.errors.name}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <FormInput
                                    name="id_fund"
                                    label="ID Fund"
                                    type="text"
                                    placeholder="Contoh: 3fa85f64-5717-4562-b3fc-2c963f66afa6"
                                    value={form.data.id_fund}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        form.setData('id_fund', e.target.value)
                                    }
                                    error={form.errors.id_fund}
                                    info="Opsional"
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
