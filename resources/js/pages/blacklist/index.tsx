import LandingLayout from '@/layouts/landing-layout';
import { Head, Link, router } from '@inertiajs/react';

import { ShieldAlert, Search, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Merchant {
    id: number;
    merchant_name: string;
    image: string | null;
    reason: string;
    created_at: string;
}

interface Props {
    merchants: {
        data: Merchant[];
        current_page: number;
        last_page: number;
    };
}

export default function IndexPage({ merchants }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState(merchants.data);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(merchants.current_page);
    const [hasMore, setHasMore] = useState(
        merchants.current_page < merchants.last_page,
    );

    const loadMore = () => {
        if (!hasMore || loading) return;

        setLoading(true);

        router.get(
            'blacklist',
            {
                page: currentPage + 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['merchants'],

                onSuccess: (page) => {
                    const newMerchants = page.props.merchants as Props['merchants'];
                    setItems((prev) => [...prev, ...newMerchants.data]);
                    setCurrentPage(newMerchants.current_page);
                    setHasMore(
                        newMerchants.current_page < newMerchants.last_page,
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
                'blacklist',
                {
                    search: searchQuery,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                    only: ['merchants'],
                    onSuccess: (page) => {
                        const data: any = page.props.merchants;

                        setItems(data.data);
                        setCurrentPage(data.current_page);
                        setHasMore(data.current_page < data.last_page);
                    },
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    useEffect(() => {
        setItems(merchants.data);
        setCurrentPage(merchants.current_page);
        setHasMore(merchants.current_page < merchants.last_page);
    }, [merchants]);

    return (
        <>
            <Head title="Blacklist Merchant" />

            <LandingLayout>
                <section className="bg-gradient-to-b from-red-50 to-white pt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
                                <ShieldAlert size={16} />
                                Transparansi Informasi
                            </div>
                            <h1 className="mt-6 text-5xl leading-tight font-bold">
                                Daftar Blacklist Merchant
                            </h1>
                            <p className="mt-6 text-lg text-slate-600">
                                Informasi merchant yang masuk dalam daftar
                                blacklist berdasarkan hasil verifikasi dan
                                evaluasi yang telah dilakukan.
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
                                placeholder="Cari merchant..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>
                        {merchants.data.length > 0 ? (
                            <div className="">
                                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                    {items.map((merchant) => (
                                        <article
                                            key={merchant.id}
                                            className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            {merchant.image ? (
                                                <img
                                                    src={merchant.image}
                                                    alt={merchant.merchant_name}
                                                    className="h-56 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-56 items-center justify-center bg-slate-100">
                                                    <ShieldAlert size={48} />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <div className="mb-3 text-sm text-slate-500">
                                                    {merchant.created_at}
                                                </div>
                                                <h2 className="text-xl font-bold">
                                                    {merchant.merchant_name}
                                                </h2>
                                                <p className="mt-4 line-clamp-4 text-slate-600">
                                                    {merchant.reason}
                                                </p>
                                                <Link
                                                    href={`/blacklist/${merchant.id}`}
                                                    className="mt-6 inline-flex items-center gap-2 font-medium text-red-600"
                                                >
                                                    Lihat Detail
                                                    <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                {hasMore && (
                                    <div className="mt-10 flex justify-center">
                                        <button
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
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
                                <ShieldAlert
                                    className="mx-auto mb-4"
                                    size={40}
                                />
                                <h3 className="text-xl font-semibold">
                                    Belum Ada Data
                                </h3>
                                <p className="mt-2 text-slate-500">
                                    Saat ini belum ada merchant yang masuk ke
                                    dalam blacklist.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}