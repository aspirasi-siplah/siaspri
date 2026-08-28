import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Building2,
    Search,
    UsersRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/custom-components/Pagination';
import LandingLayout from '@/layouts/landing-layout';
import principals from '@/routes/principals';

type Reseller = {
    id: number;
    name: string;
    document_number: string | null;
    reference_code: string | null;
    reference_link: string | null;
};
type Resellers = {
    data: Reseller[];
    current_page: number;
    last_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};
type Principal = {
    id: number;
    name: string;
    notes: string | null;
    resellers_total: number;
    resellers: Resellers;
};
export default function Show({ principal }: { principal: Principal }) {
    const [search, setSearch] = useState('');
    const initial = useRef(true);

    useEffect(() => {
        if (initial.current) {
            initial.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                principals.show(principal.id),
                { search: search.trim(), page: 1 },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['principal'],
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, principal.id]);

    return (
        <>
            <Head title={principal.name} />
            <LandingLayout>
                <main className="overflow-hidden pt-28 pb-24 sm:pt-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6">
                        <Link
                            href={principals.index()}
                            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
                        >
                            <ArrowLeft
                                size={16}
                                className="transition-transform group-hover:-translate-x-1"
                            />
                            Kembali ke Principal
                        </Link>

                        <header className="relative mt-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-blue-950/10 sm:px-10 sm:py-11 lg:px-14">
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(37,99,235,0.35),transparent_48%,rgba(16,185,129,0.16))]" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [mask-image:linear-gradient(to_left,black,transparent)] [background-size:32px_32px] opacity-30" />
                            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-3 text-blue-300">
                                        <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-300/20 ring-inset">
                                            <Building2 size={23} />
                                        </span>
                                        <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                                            Profil Principal
                                        </span>
                                    </div>
                                    <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
                                        {principal.name}
                                    </h1>
                                    {principal.notes && (
                                        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                                            {principal.notes}
                                        </p>
                                    )}
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:min-w-48">
                                    <UsersRound
                                        size={18}
                                        className="text-emerald-200"
                                    />
                                    <p className="mt-3 text-2xl font-bold">
                                        {principal.resellers_total}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-300">
                                        Reseller terdaftar
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className="pt-10">
                            <section aria-labelledby="resellers-heading">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold tracking-[0.18em] text-emerald-600 uppercase">
                                            Jaringan usaha
                                        </p>
                                        <h2
                                            id="resellers-heading"
                                            className="mt-2 text-2xl font-bold tracking-tight text-slate-900"
                                        >
                                            Reseller terdaftar
                                        </h2>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        {principal.resellers_total} reseller
                                    </span>
                                </div>

                                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm lg:w-1/3">
                                    <Search
                                        size={16}
                                        className="shrink-0 text-slate-400"
                                    />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari nama reseller..."
                                        className="w-full text-sm outline-none placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <table className="w-full min-w-[580px] text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs tracking-wide text-slate-500 uppercase">
                                                <th className="px-5 py-4">
                                                    Nama reseller
                                                </th>
                                                <th className="px-5 py-4">
                                                    Reference link
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {principal.resellers.data.map(
                                                (reseller) => (
                                                    <tr
                                                        key={reseller.id}
                                                        className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                                                    >
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                                                                    {reseller.name
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                                <span className="font-semibold text-slate-800">
                                                                    {
                                                                        reseller.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            {reseller.reference_link ? (
                                                                <Link
                                                                    href={
                                                                        reseller.reference_link
                                                                    }
                                                                    title={
                                                                        reseller.reference_link
                                                                    }
                                                                    className="inline-flex max-w-56 items-center gap-1.5 text-xs font-medium text-blue-600 transition hover:text-blue-700"
                                                                >
                                                                    <span className="truncate">
                                                                        {
                                                                            reseller.reference_link
                                                                        }
                                                                    </span>
                                                                    <ArrowUpRight
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="shrink-0"
                                                                    />
                                                                </Link>
                                                            ) : (
                                                                <span className="text-slate-400">
                                                                    -
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                    {!principal.resellers.data.length && (
                                        <p className="p-8 text-center text-sm text-slate-500">
                                            Belum ada reseller.
                                        </p>
                                    )}
                                </div>

                                {principal.resellers.data.length > 0 &&
                                    principal.resellers.last_page > 1 && (
                                        <div className="mt-5">
                                            <Pagination
                                                current_page={
                                                    principal.resellers
                                                        .current_page
                                                }
                                                next_page_url={
                                                    principal.resellers
                                                        .next_page_url
                                                }
                                                prev_page_url={
                                                    principal.resellers
                                                        .prev_page_url
                                                }
                                            />
                                        </div>
                                    )}
                            </section>
                        </div>
                    </div>
                </main>
            </LandingLayout>
        </>
    );
}