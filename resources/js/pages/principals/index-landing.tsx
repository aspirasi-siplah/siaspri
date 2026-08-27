import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Building2, Search } from 'lucide-react';
import { useState } from 'react';
import LandingLayout from '@/layouts/landing-layout';
import principals from '@/routes/principals';

type Principal = {
    id: number;
    name: string;
    notes: string | null;
    resellers_count: number;
    documents_count: number;
};
export default function Index({
    principals: data,
}: {
    principals: { data: Principal[]; current_page: number; last_page: number };
}) {
    const [search, setSearch] = useState('');
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(
            principals.index.url(),
            { search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Principal" />
            <LandingLayout>
                <section className="bg-gradient-to-b from-blue-50 to-white pt-32 pb-16">
                    <div className="mx-auto max-w-7xl px-6">
                        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
                            Direktori Principal
                        </p>
                        <h1 className="mt-4 text-4xl font-bold md:text-5xl">
                            Principal dan jaringan resellernya
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg text-slate-600">
                            Temukan informasi Principal dan dokumen pendukung
                            yang tersedia untuk publik.
                        </p>
                        <form
                            onSubmit={submit}
                            className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm"
                        >
                            <Search size={18} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama Principal"
                                className="w-full outline-none"
                            />
                        </form>
                    </div>
                </section>
                <section className="pb-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {data.data.map((principal) => (
                                <article
                                    key={principal.id}
                                    className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <Building2
                                        className="text-blue-600"
                                        size={24}
                                    />
                                    <h2 className="mt-5 text-xl font-bold">
                                        {principal.name}
                                    </h2>
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                                        {principal.notes ||
                                            'Informasi Principal tersedia di halaman detail.'}
                                    </p>
                                    <div className="mt-6 flex gap-5 text-sm text-slate-500">
                                        <span>
                                            {principal.resellers_count} Reseller
                                        </span>
                                        <span>
                                            {principal.documents_count} Dokumen
                                        </span>
                                    </div>
                                    <Link
                                        href={principals.show(principal.id)}
                                        className="mt-6 inline-flex items-center gap-2 font-medium text-blue-600"
                                    >
                                        Lihat detail <ArrowRight size={16} />
                                    </Link>
                                </article>
                            ))}
                        </div>
                        {!data.data.length && (
                            <div className="py-20 text-center text-slate-500">
                                Belum ada Principal.
                            </div>
                        )}
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}
