import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Trash2, UsersRound } from 'lucide-react';
import Swal from 'sweetalert2';
import CustomTable from '@/components/custom-components/CustomTable';
import Pagination from '@/components/custom-components/Pagination';
import ModalForm from '@/components/user-management/ModalForm';
import AppLayout from '@/layouts/app-layout';

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
    users: {
        data: User[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        per_page: number;
        from: number;
        to: number;
    };
    role_options: RoleOption[];
}

export default function IndexUserManagement({ users, role_options }: Props) {
    const roleLabel: Record<string, string> = {
        admin: 'Superadmin',
        user: 'Admin',
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Pengguna',
            text: 'Anda akan menghapus pengguna ini',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#a5a5a5',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Kembali',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.delete(`user-management/${id}/delete`, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Pengguna berhasil dihapus.',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: 'Pengguna gagal dihapus.',
                        });
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Tambah Pengguna" />
            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Tambah Pengguna',
                        href: '',
                    },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Tambah Pengguna
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola akun pengguna yang memiliki akses ke
                                sisi admin.
                            </p>
                        </div>
                        <ModalForm roleOptions={role_options} />
                    </div>

                    <CustomTable
                        title="Daftar Pengguna"
                        icon={
                            <UsersRound
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={[
                            'Pengguna',
                            'Email',
                            'Role',
                            'Dibuat',
                            'Aksi',
                        ]}
                        headerAlign={[
                            'text-left',
                            'text-left',
                            'text-left',
                            'text-left',
                            'text-center',
                        ]}
                    >
                        {users.data.length > 0 ? (
                            users.data.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="px-4 py-3 text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            {user.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                user.role === 'admin'
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'bg-emerald-50 text-emerald-700'
                                            }`}
                                        >
                                            {user.role === 'admin' && (
                                                <ShieldCheck size={13} />
                                            )}
                                            {roleLabel[user.role] ?? user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {user.created_at}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <ModalForm
                                                user={user}
                                                roleOptions={role_options}
                                            />
                                            <button
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                className="cursor-pointer rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-16 text-center text-sm text-gray-700"
                                >
                                    Belum ada pengguna
                                </td>
                            </tr>
                        )}
                    </CustomTable>

                    <Pagination
                        current_page={users.current_page}
                        next_page_url={users.next_page_url}
                        prev_page_url={users.prev_page_url}
                    />
                </div>
            </AppLayout>
        </>
    );
}
