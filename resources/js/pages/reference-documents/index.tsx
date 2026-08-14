import { Head, Link, router } from '@inertiajs/react';

import {
    FileCheck2,
    Search,
    ArrowRight,
    Building2,
    CalendarDays,
    Hash,
    Tag,
    Link2,
    Copy,
    Check,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useClipboard } from '@/hooks/use-clipboard';
import LandingLayout from '@/layouts/landing-layout';
import { statusConfig } from '@/lib/reference-documents';
import type { ReferenceDocument } from '@/lib/reference-documents';

interface Props {
    documents: {
        data: ReferenceDocument[];
        current_page: number;
        last_page: number;
    };
}

export default function IndexPage({ documents }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState(documents.data);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(documents.current_page);
    const [hasMore, setHasMore] = useState(
        documents.current_page < documents.last_page,
    );
    const [copied, copy] = useClipboard();

    const copyLink = async (link: string) => {
        const success = await copy(link);

        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Tersalin!',
                text: 'Reference link berhasil disalin.',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    const loadMore = () => {
        if (!hasMore || loading) {
            return;
        }

        setLoading(true);

        router.get(
            'reference-documents',
            {
                page: currentPage + 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['documents'],

                onSuccess: (page) => {
                    const newDocuments = page.props
                        .documents as Props['documents'];
                    setItems((prev) => [...prev, ...newDocuments.data]);
                    setCurrentPage(newDocuments.current_page);
                    setHasMore(
                        newDocuments.current_page < newDocuments.last_page,
                    );
                },

                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    };

    //Debounce query
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                'reference-documents',
                {
                    search: searchQuery,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    only: ['documents'],
                    onSuccess: (page) => {
                        const data: any = page.props.documents;

                        setItems(data.data);
                        setCurrentPage(data.current_page);
                        setHasMore(data.current_page < data.last_page);
                    },
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    return (
        <>
            <Head title="Reference Document" />

            <LandingLayout>
                <section className="bg-gradient-to-b from-blue-50 to-white pt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600">
                                <FileCheck2 size={16} />
                                Dokumen Referensi
                            </div>
                            <h1 className="mt-6 text-5xl leading-tight font-bold">
                                Principal Reference Document
                            </h1>
                            <p className="mt-6 text-lg text-slate-600">
                                Kumpulan dokumen referensi milik Principal yang
                                telah tersimpan dalam sistem, lengkap dengan
                                reference link untuk keperluan verifikasi.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="pb-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-12 flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-sm">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Cari reference id, principal, program, atau nomor dokumen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>
                        {items.length > 0 ? (
                            <div className="">
                                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                    {items.map((document) => {
                                        const status =
                                            statusConfig[document.status];

                                        return (
                                            <article
                                                key={document.id}
                                                className="group flex flex-col justify-between overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                            >
                                                <div className="p-6">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status?.color}`}
                                                        >
                                                            {status?.label}
                                                        </span>
                                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                                            {document.category_name ??
                                                                '-'}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-xl font-bold">
                                                        {
                                                            document.principal_name
                                                        }
                                                    </h2>
                                                    <div className="mt-3 text-sm text-slate-500">
                                                        {document.program_name}
                                                    </div>
                                                    <div className="mt-6 space-y-3 text-sm">
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Hash size={14} />
                                                            <span className="font-medium text-gray-700">
                                                                {
                                                                    document.reference_id
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <Tag size={14} />
                                                            Nomor Dokumen:{' '}
                                                            {
                                                                document.document_number
                                                            }
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-600">
                                                            <CalendarDays
                                                                size={14}
                                                            />
                                                            Kedaluwarsa:{' '}
                                                            {
                                                                document.expired_date
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
                                                        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                                                            <Link2 size={12} />
                                                            <span className="truncate">
                                                                {
                                                                    document.reference_link
                                                                }
                                                            </span>
                                                        </div>
                                                        {copied ===
                                                        document.reference_link ? (
                                                            <Check
                                                                size={14}
                                                                className="shrink-0 text-green-600"
                                                            />
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    copyLink(
                                                                        document.reference_link,
                                                                    )
                                                                }
                                                                className="shrink-0 cursor-pointer text-blue-600 hover:text-blue-700"
                                                                title="Salin link"
                                                            >
                                                                <Copy
                                                                    size={14}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="px-6 pb-6">
                                                    <Link
                                                        href={`/reference-documents/${document.reference_id}`}
                                                        className="mt-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
                                                    >
                                                        Lihat Detail
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                                {hasMore && (
                                    <div className="mt-10 flex justify-center">
                                        <button
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {loading
                                                ? 'Memuat Data...'
                                                : 'Tampilkan Lebih Banyak'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed p-20 text-center">
                                <Building2 className="mx-auto mb-4" size={40} />
                                <h3 className="text-xl font-semibold">
                                    Belum Ada Data
                                </h3>
                                <p className="mt-2 text-slate-500">
                                    Saat ini belum ada Reference Document yang
                                    tersimpan dalam sistem.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}
