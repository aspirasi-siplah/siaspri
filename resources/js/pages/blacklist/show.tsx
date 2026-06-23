import LandingLayout from '@/layouts/landing-layout';

import { Head, Link } from '@inertiajs/react';

import {
    ShieldAlert,
    CalendarDays,
    ArrowLeft,
    AlertTriangle,
} from 'lucide-react';

interface Merchant {
    id: number;
    merchant_name: string;
    image: string | null;
    reason: string;
    created_at: string;
}

interface Props {
    merchant: Merchant;
}

export default function ShowPage({ merchant }: Props) {
    return (
        <>
            <Head title={`${merchant.merchant_name} - Blacklist Merchant`} />

            <LandingLayout>
                <article className="pt-32 pb-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <Link
                            href="/blacklist"
                            className="mb-8 inline-flex items-center gap-2 text-sm text-primary"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Daftar Blacklist
                        </Link>

                        <div className="mb-12 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-600">
                                <ShieldAlert size={16} />
                                Merchant Blacklist
                            </div>

                            <h1 className="mt-6 text-4xl font-bold md:text-5xl">
                                {merchant.merchant_name}
                            </h1>

                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                                <CalendarDays size={16} />
                                Masuk daftar blacklist pada{' '}
                                {merchant.created_at}
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                            {merchant.image ? (
                                <img
                                    src={merchant.image}
                                    alt={merchant.merchant_name}
                                    className="h-[450px] w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-[350px] items-center justify-center bg-slate-100">
                                    <ShieldAlert size={80} />
                                </div>
                            )}
                        </div>

                        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
                            <div className="flex gap-4">
                                <AlertTriangle className="mt-1 shrink-0 text-red-600" />

                                <div>
                                    <h2 className="text-lg font-semibold text-red-700">
                                        Informasi Penting
                                    </h2>

                                    <p className="mt-2 text-red-700">
                                        Merchant ini telah masuk ke dalam daftar
                                        blacklist berdasarkan hasil evaluasi dan
                                        verifikasi yang dilakukan oleh pihak
                                        marketplace.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <section className="mt-12">
                            <h2 className="mb-6 text-2xl font-bold">
                                Alasan Blacklist
                            </h2>

                            <div className="rounded-3xl border bg-white p-8 shadow-sm">
                                <div className="prose prose-slate max-w-none">
                                    {merchant.reason}
                                </div>
                            </div>
                        </section>

                        <div className="mt-16 rounded-3xl bg-slate-50 p-10 text-center">
                            <h3 className="text-2xl font-bold">
                                Tetap Bertransaksi Dengan Aman
                            </h3>

                            <p className="mt-3 text-slate-600">
                                Pastikan selalu melakukan verifikasi informasi
                                sebelum melakukan transaksi dengan merchant mana
                                pun.
                            </p>

                            <Link
                                href="/blacklist"
                                className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-white"
                            >
                                Lihat Merchant Lainnya
                            </Link>
                        </div>
                    </div>
                </article>
            </LandingLayout>
        </>
    );
}