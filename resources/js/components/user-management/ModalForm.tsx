import { useForm } from '@inertiajs/react';
import { Mail, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import CustomModal from '@/components/custom-components/CustomModal';
import FormInput from '@/components/custom-components/FormInput';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface RoleOption {
    value: string;
    label: string;
}

interface Props {
    user?: User;
    roleOptions: RoleOption[];
}

export default function ModalForm({ user, roleOptions }: Props) {
    const [open, setOpen] = useState(false);
    const isEdit = !!user;

    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
    });

    const handleOpen = () => {
        if (user) {
            form.setData({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            form.reset();
        }

        form.clearErrors();
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
                        ? 'Pengguna berhasil diperbarui.'
                        : 'Pengguna berhasil ditambahkan.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: isEdit
                        ? 'Pengguna gagal diperbarui.'
                        : 'Pengguna gagal ditambahkan.',
                });
            },
        };

        if (isEdit) {
            form.put(`user-management/${user?.id}`, options);

            return;
        }

        form.post('user-management', options);
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
                    Tambah Pengguna
                </button>
            )}

            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title={isEdit ? 'Ubah Pengguna' : 'Tambah Pengguna'}
                size="md"
            >
                <form onSubmit={submit} className="space-y-5">
                    <FormInput
                        name="name"
                        label="Nama"
                        type="text"
                        placeholder="Masukkan nama pengguna"
                        value={form.data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            form.setData('name', e.target.value)
                        }
                        error={form.errors.name}
                        required
                    />

                    <FormInput
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Masukkan email pengguna"
                        value={form.data.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            form.setData('email', e.target.value)
                        }
                        error={form.errors.email}
                        required
                    />

                    <div className="flex w-full flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">
                            Role <span className="text-[13px] text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            value={form.data.role}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                form.setData('role', e.target.value)
                            }
                            className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {form.errors.role && (
                            <span className="text-xs text-red-500">
                                {form.errors.role}
                            </span>
                        )}
                    </div>

                    {!isEdit && (
                        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                            <span className="mt-0.5">
                                <Mail size={15} />
                            </span>
                            <p>
                                Sistem akan mengirimkan email berisi link ke pengguna
                                untuk mengatur password baru.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => setOpen(false)}
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
