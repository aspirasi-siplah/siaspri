import { Link } from '@inertiajs/react';
import { FileCheck2, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { statusConfig } from '@/lib/reference-documents';

export default function ReferenceDocumentIntro() {
    return (
        <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl sm:rounded-3xl">
                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />

                    <div className="relative grid items-center gap-10 p-6 sm:p-8 md:grid-cols-2 md:gap-12 md:p-12 lg:p-16">
                        {/* Left Content */}
                        <div className="min-w-0">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm sm:px-4 sm:text-sm">
                                <FileCheck2 size={15} />
                                Dokumen Principal
                            </span>

                            <h2 className="mt-5 text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl md:mt-6 md:text-4xl">
                                Pastikan Setiap Dokumen Principal Terverifikasi
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 sm:text-base sm:leading-relaxed">
                                Telusuri dan verifikasi dokumen referensi milik
                                Principal yang telah terdaftar resmi dalam
                                sistem kami. Setiap dokumen memiliki reference
                                link unik untuk memastikan keaslian dan
                                validitasnya.
                            </p>

                            <Link
                                href="/reference-documents"
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-[0.98] sm:mt-8 sm:w-auto sm:px-6 sm:py-3"
                            >
                                Lihat Semua Dokumen
                                <ArrowRight size={17} />
                            </Link>
                        </div>

                        {/* Right Content */}
                        <div className="min-w-0 space-y-4">
                            {/* Reference ID Card */}
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2 text-xs font-medium text-white sm:text-sm">
                                        <ShieldCheck
                                            size={16}
                                            className="shrink-0"
                                        />
                                        <span>Contoh Reference ID</span>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium sm:text-xs ${statusConfig.active.color}`}
                                    >
                                        {statusConfig.active.label}
                                    </span>
                                </div>

                                <p className="mt-4 overflow-hidden font-mono text-base font-semibold text-ellipsis whitespace-nowrap text-white sm:text-lg">
                                    ASPRI-PPK-48231
                                </p>

                                <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl bg-black/20 px-3 py-2.5 text-[11px] text-blue-100 sm:text-xs">
                                    <Copy size={12} className="shrink-0" />

                                    <span className="min-w-0 truncate">
                                        https://aspri.example.com/verify/ASPRI-PPK-48231
                                    </span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm sm:p-5">
                                    <p className="text-xl font-bold text-white sm:text-2xl">
                                        Unik
                                    </p>
                                    <p className="mt-1.5 text-[11px] leading-5 text-blue-100 sm:text-xs">
                                        Reference ID berbeda untuk setiap
                                        dokumen
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm sm:p-5">
                                    <p className="text-xl font-bold text-white sm:text-2xl">
                                        Mudah
                                    </p>
                                    <p className="mt-1.5 text-[11px] leading-5 text-blue-100 sm:text-xs">
                                        Salin link dan verifikasi kapan saja
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm sm:p-5">
                                    <p className="text-xl font-bold text-white sm:text-2xl">
                                        Aman
                                    </p>
                                    <p className="mt-1.5 text-[11px] leading-5 text-blue-100 sm:text-xs">
                                        Data terdaftar resmi oleh Principal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
