import ModalForm from '@/components/blacklist-merchants/ModalForm';
import CustomTable from '@/components/custom-components/CustomTable';
import Pagination from '@/components/custom-components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Plus, Store } from 'lucide-react';
import Swal from 'sweetalert2';

interface BlacklistMerchant {
    id: number;
    merchant_name: string;
    image: string | null;
    reason: string;
    created_at: string;
}

interface Props {
    merchants: {
        data: BlacklistMerchant[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        per_page: number;
        from: number;
        to: number;
    };
}

export default function Index({ merchants }: Props) {

    const destroy = (merchantId: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`blacklist-merchants/${merchantId}/delete`, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Merchant berhasil dihapus.',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: 'Merchant gagal dihapus.',
                        });
                    },
                });
            }
        })
    };

    return (
        <>
            <Head title="Blacklist Merchant" />
            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Blacklist Merchant',
                        href: '',
                    },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Blacklist Merchant
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola daftar merchant yang masuk blacklist.
                            </p>
                        </div>
                        <ModalForm />
                    </div>
                    <CustomTable
                        title="Daftar Merchant"
                        icon={
                            <Store
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={['Merchant', 'Alasan', 'Dibuat', 'Aksi']}
                        headerAlign={[
                            'text-left',
                            'text-left',
                            'text-left',
                            'text-center',
                        ]}
                    >
                        {merchants.data.length > 0 ? (
                            merchants.data.map((merchant) => (
                                <tr key={merchant.id} className="border-t">
                                    <td className="px-4 py-1">
                                        <div className="flex items-center gap-4">
                                            {merchant.image ? (
                                                <img
                                                    src={merchant.image}
                                                    alt={merchant.merchant_name}
                                                    className="h-14 w-14 rounded-xl object-cover text-xs text-muted-foreground"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                                                    <Store
                                                        size={20}
                                                        className="text-muted-foreground"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {merchant.merchant_name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="w-2/5 max-w-sm px-4 py-1 text-sm text-wrap break-words text-gray-600">
                                        {merchant.reason.length > 50
                                            ? merchant.reason.substring(0, 50) + '... '
                                            : merchant.reason
                                        }
                                    </td>
                                    <td className="px-4 py-1 text-sm text-gray-700 font-medium">
                                        {merchant.created_at}
                                    </td>
                                    <td className="px-4 py-1">
                                        <div className="flex justify-center gap-2">
                                            <ModalForm merchant={merchant} />
                                            <button onClick={() => destroy(merchant.id)} className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 cursor-pointer">
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
                                    className="py-16 text-center text-sm text-gray-700"
                                >
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </CustomTable>
                    <Pagination
                        current_page={merchants.current_page}
                        next_page_url={merchants.next_page_url}
                        prev_page_url={merchants.prev_page_url}
                        per_page={merchants.per_page}
                        from={merchants.from}
                        to={merchants.to}
                    />
                </div>
            </AppLayout>
        </>
    );
}