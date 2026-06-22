import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Plus, Pencil, Trash2, Newspaper, Image, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import Pagination from '@/components/custom-components/Pagination';
import CustomTable from '@/components/custom-components/CustomTable';

export interface News {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
}

interface Props {
    news: {
        data: News[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        per_page: number;
        from: number;
        to: number;
    };
}

const statusLabels = {
    draft: {
        label: 'Draft',
        color: ' bg-yellow-100 text-yellow-700',
    },
    published: {
        label: 'Diterbitkan',
        color: ' bg-green-100 text-green-700',
    },
    archived: {
        label: 'Arsip',
        color: ' bg-gray-100 text-gray-700',
    },
};

export default function NewsIndex({ news }: Props) {
    const destroy = (id: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(`news-management/${id}/delete`, {
                    preserveState: true,
                    preserveScroll: true,
                });

                Swal.fire(
                    'Berhasil!',
                    'Berita berhasil dihapus.',
                    'success'
                );
            }
        })
    };

    return (
        <>
            <Head title="Manajemen Berita" />
            <AppLayout
                breadcrumbs={[
                    { title: 'Manajemen Berita', href: '/news-management' },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Manajemen Berita
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola seluruh berita kegiatan.
                            </p>
                        </div>

                        <Link
                            href={'news-management/create'}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm text-primary-foreground hover:bg-blue-600"
                        >
                            <Plus size={16} />
                            Tambah Berita
                        </Link>
                    </div>
                    <CustomTable
                        title="Daftar Berita"
                        icon={
                            <Newspaper
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={[
                            'Thumbnail',
                            'Judul',
                            'Status',
                            'Tanggal Terbit',
                            'Aksi',
                        ]}
                        headerAlign={[
                            'text-left',
                            'text-left',
                            'text-center',
                            'text-center',
                            'text-center',
                        ]}
                    >
                        {news.data.length > 0 ? (
                            news.data.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="p-4">
                                        {item.thumbnail ? (
                                            <img
                                                src={
                                                    item.thumbnail ??
                                                    '/images/placeholder.png'
                                                }
                                                alt=""
                                                className="h-14 w-20 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-14 w-20 flex-col items-center justify-center rounded-lg bg-gray-100">
                                                <Image
                                                    size={20}
                                                    className="text-gray-400"
                                                />
                                                <p className="text-[10px] font-medium text-gray-300">
                                                    No Image
                                                </p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.title}
                                            </p>
                                            <p className="text-[13px] text-muted-foreground">
                                                /{item.slug}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusLabels[item.status]?.color || statusLabels.draft.color}`}
                                        >
                                            {statusLabels[item.status]?.label ||
                                                statusLabels.draft.label}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-sm font-medium text-gray-700">
                                        {item.published_at}
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`news-management/${item.id}/show`}
                                                className="rounded-lg border p-2 text-blue-500"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`news-management/${item.id}/edit`}
                                                className="rounded-lg border p-2"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                onClick={() => destroy(item.id)}
                                                className="rounded-lg border p-2 text-red-500"
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
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </CustomTable>
                    <Pagination
                        current_page={news.current_page}
                        next_page_url={news.next_page_url}
                        prev_page_url={news.prev_page_url}
                        per_page={news.per_page}
                        from={news.from}
                        to={news.to}
                    />
                </div>
            </AppLayout>
        </>
    );
}