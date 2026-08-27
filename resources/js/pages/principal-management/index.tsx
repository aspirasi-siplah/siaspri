import { Head, Link, router } from '@inertiajs/react';
import { Building2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import ModalForm from '@/components/principal-management/ModalForm';
import AppLayout from '@/layouts/app-layout';
import principalManagement from '@/routes/principal-management';

interface Principal {
    id: number;
    name: string;
    notes: string | null;
    npwp_number: string | null;
    nib: string | null;
    resellers_count: number;
    documents_count: number;
    created_at: string | null;
}
interface Props {
    principals: {
        data: Principal[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

export default function Index({ principals }: Props) {
    const destroy = (id: number) => {
        Swal.fire({
            title: 'Hapus Principal',
            text: 'Anda akan menghapus principal ini beserta data terkaitnya.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#a5a5a5',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Kembali',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(principalManagement.destroy.url(id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Principal berhasil dihapus.',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: 'Principal gagal dihapus.',
                        });
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Principal" />
            <AppLayout
                breadcrumbs={[
                    { title: 'Principal', href: principalManagement.index() },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Principal</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola data Principal, reseller, dan dokumen
                                pendukung.
                            </p>
                        </div>
                        <ModalForm />
                    </div>
                    <div className="overflow-x-auto rounded-xl border bg-white">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b bg-slate-50">
                                    <th className="p-4">Principal</th>
                                    <th className="p-4">Reseller</th>
                                    <th className="p-4">Dokumen</th>
                                    <th className="p-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {principals.data.length ? (
                                    principals.data.map((principal) => (
                                        <tr
                                            key={principal.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="p-4">
                                                <Link
                                                    href={principalManagement.show(
                                                        principal.id,
                                                    )}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    {principal.name}
                                                </Link>
                                                <p className="text-xs text-slate-500">
                                                    {principal.npwp_number ||
                                                        'NPWP belum diisi'}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                {principal.resellers_count}
                                            </td>
                                            <td className="p-4">
                                                {principal.documents_count}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <ModalForm
                                                        principal={principal}
                                                    />
                                                    <button
                                                        title="Hapus"
                                                        onClick={() =>
                                                            destroy(
                                                                principal.id,
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 p-2 text-red-500"
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
                                            colSpan={4}
                                            className="p-12 text-center text-slate-500"
                                        >
                                            <Building2 className="mx-auto mb-2" />
                                            Belum ada Principal.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
