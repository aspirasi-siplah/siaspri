import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';

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
    };
}

export default function Index({ merchants }: Props) {
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
                        <Link
                            href={`/blacklist-merchants/create`}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white"
                        >
                            <Plus size={16} />
                            Tambah Merchant
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-2xl border bg-white">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        Merchant
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Alasan
                                    </th>

                                    <th className="px-6 py-4 text-left">
                                        Dibuat
                                    </th>

                                    <th className="px-6 py-4 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {merchants.data.length > 0 ? (
                                    merchants.data.map((merchant) => (
                                        <tr
                                            key={merchant.id}
                                            className="border-t"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {merchant.image ? (
                                                        <img
                                                            src={merchant.image}
                                                            alt={
                                                                merchant.merchant_name
                                                            }
                                                            className="h-14 w-14 rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                                                            —
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                merchant.merchant_name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="max-w-sm px-6 py-4">
                                                {merchant.reason}
                                            </td>

                                            <td className="px-6 py-4">
                                                {merchant.created_at}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <Link
                                                        href={`/blacklist-merchants/${merchant.id}`}
                                                        className="rounded-lg border p-2"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>

                                                    <Link
                                                        href={`/blacklist-merchants/${merchant.id}/edit`}
                                                        className="rounded-lg border p-2"
                                                    >
                                                        <Pencil size={16} />
                                                    </Link>

                                                    <button className="rounded-lg border border-red-200 p-2 text-red-500">
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
                                            className="py-16 text-center text-muted-foreground"
                                        >
                                            Belum ada merchant yang diblacklist.
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