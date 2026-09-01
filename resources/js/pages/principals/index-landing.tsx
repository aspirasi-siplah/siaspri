import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Download,
    FileText,
    Search,
    UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/custom-components/Pagination';
import LandingLayout from '@/layouts/landing-layout';
import principals from '@/routes/principals';
import templateDocuments from '@/routes/template-documents';

type Principal = {
    id: number;
    name: string;
    notes: string | null;
    resellers_count: number;
    documents_count: number;
};

type TemplateDocument = {
    id: string;
    label: string;
    file_name: string;
    file_path: string;
    updated_at: string;
};

export default function Index({
    principals: data,
    template_documents,
}: {
    principals: {
        data: Principal[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
    };
    template_documents: TemplateDocument[];
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
                <main className="overflow-hidden pt-28 pb-24 sm:pt-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <header className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-blue-950/10 sm:px-10 sm:py-11 lg:px-14">
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(37,99,235,0.35),transparent_48%,rgba(16,185,129,0.16))]" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [mask-image:linear-gradient(to_left,black,transparent)] [background-size:32px_32px] opacity-30" />
                            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-3 text-blue-300">
                                        <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-300/20 ring-inset">
                                            <Building2 size={23} />
                                        </span>
                                    </div>
                                    <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
                                        Principal dan jaringan resellernya
                                    </h1>
                                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                        Temukan informasi Principal dan
                                        Resellernya
                                    </p>
                                </div>

                                <form
                                    onSubmit={submit}
                                    className="w-full rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm lg:max-w-sm"
                                >
                                    <label className="block text-xs font-semibold tracking-wide text-slate-300 uppercase">
                                        Cari Principal
                                    </label>
                                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-sm">
                                        <Search
                                            size={16}
                                            className="shrink-0 text-slate-400"
                                        />
                                        <input
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Ketik nama Principal"
                                            className="w-full text-sm text-slate-800 outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                </form>
                            </div>
                        </header>

                        {template_documents.length > 0 && (
                            <section
                                aria-labelledby="templates-heading"
                                className="pt-12"
                            >
                                <div>
                                    <h2
                                        id="templates-heading"
                                        className="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                                    >
                                        Unduh Dokumen Template
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Unduh dokumen template yang disediakan
                                        untuk Anda.
                                    </p>
                                </div>
                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {template_documents.map((doc, index) => (
                                        <div
                                            key={doc.id}
                                            className={`flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm`}
                                        >
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <FileText size={17} />
                                            </span>
                                            <div className="w-full">
                                                <p className="truncate text-sm font-medium text-slate-800">
                                                    {doc.label}
                                                </p>
                                                <a
                                                    href={
                                                        templateDocuments.download(
                                                            doc.id,
                                                        ).url
                                                    }
                                                    title={`Unduh ${doc.label}`}
                                                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium hover:text-blue-600 text-gray-500"
                                                >
                                                    <Download size={13} />
                                                    Unduh
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section
                            aria-labelledby="principals-heading"
                            className="pt-12"
                        >
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <h2
                                        id="principals-heading"
                                        className="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                                    >
                                        Daftar Principal
                                    </h2>
                                </div>
                                <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                                    {data.data.length} principal
                                </span>
                            </div>

                            {data.data.length ? (
                                <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {data.data.map((principal) => (
                                        <article
                                            key={principal.id}
                                            className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-100/60"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-600/20">
                                                    <Building2 size={24} />
                                                </span>
                                            </div>
                                            <h3 className="mt-5 text-xl font-bold text-slate-900">
                                                {principal.name}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {principal.notes ||
                                                    'Informasi Principal tersedia di halaman detail.'}
                                            </p>
                                            <div className="mt-6 flex items-center gap-5 border-t border-slate-100 pt-5 text-sm text-slate-600">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <UsersRound
                                                        size={15}
                                                        className="text-emerald-600"
                                                    />
                                                    {principal.resellers_count}{' '}
                                                    Reseller
                                                </span>
                                            </div>
                                            <Link
                                                href={principals.show(
                                                    principal.id,
                                                )}
                                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition group-hover:gap-3 hover:text-blue-700"
                                            >
                                                Lihat Detail
                                                <ArrowRight size={16} />
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-20 text-center">
                                    <Building2
                                        className="mx-auto mb-4 text-slate-300"
                                        size={40}
                                    />
                                    <h3 className="text-xl font-semibold text-slate-800">
                                        Belum Ada Principal
                                    </h3>
                                    <p className="mt-2 text-slate-500">
                                        Belum ada Principal yang terdaftar dalam
                                        sistem.
                                    </p>
                                </div>
                            )}

                            {data.data.length > 0 && data.last_page > 1 && (
                                <div className="mt-12">
                                    <Pagination
                                        current_page={data.current_page}
                                        next_page_url={data.next_page_url}
                                        prev_page_url={data.prev_page_url}
                                    />
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </LandingLayout>
        </>
    );
}
