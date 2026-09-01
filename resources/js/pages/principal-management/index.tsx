import { Head, Link, router } from '@inertiajs/react';
import { Building2, Eye, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import CustomTable from '@/components/custom-components/CustomTable';
import Pagination from '@/components/custom-components/Pagination';
import ModalForm from '@/components/principal-management/ModalForm';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
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
        per_page: number;
        from: number;
        to: number;
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
                    <CustomTable
                        title="Daftar Principal"
                        icon={
                            <Building2
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={['Principal', 'Reseller', 'Dokumen', 'Aksi']}
                        headerAlign={[
                            'text-left',
                            'text-center',
                            'text-center',
                            'text-center',
                        ]}
                    >
                        {principals.data.length ? (
                            principals.data.map((principal) => (
                                <tr key={principal.id} className="border-t">
                                    <td className="max-w-64 px-4 py-1">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium">
                                                {principal.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {principal.npwp_number ||
                                                    'NPWP belum diisi'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-1 text-sm font-medium text-gray-700 text-center">
                                        {principal.resellers_count}
                                    </td>
                                    <td className="px-4 py-1 text-sm text-gray-600 text-center">
                                        {principal.documents_count}
                                    </td>
                                    <td className="px-4 py-1">
                                        <div className="flex justify-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={principalManagement.show(
                                                            principal.id,
                                                        )}
                                                        className="cursor-pointer rounded-lg border p-2 text-blue-500 hover:bg-blue-50"
                                                    >
                                                        <Eye size={16} />
                                                        <span className="sr-only">
                                                            Lihat Detail
                                                        </span>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Lihat Detail</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="inline-flex">
                                                        <ModalForm
                                                            principal={
                                                                principal
                                                            }
                                                        />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ubah Principal</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() =>
                                                            destroy(
                                                                principal.id,
                                                            )
                                                        }
                                                        className="cursor-pointer rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span className="sr-only">
                                                            Hapus
                                                        </span>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Hapus</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-16 text-center text-sm text-gray-700"
                                >
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </CustomTable>
                    <Pagination
                        current_page={principals.current_page}
                        next_page_url={principals.next_page_url}
                        prev_page_url={principals.prev_page_url}
                    />
                </div>
            </AppLayout>
        </>
    );
}