import { Link } from '@inertiajs/react';
import { FileCheck2, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { statusConfig } from '@/lib/reference-documents';

export default function ReferenceDocumentIntro() {
    return (
        <section className="bg-slate-50 py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
                    <div className="grid items-center gap-12 p-10 md:grid-cols-2 md:p-16">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
                                <FileCheck2 size={16} />
                                Dokumen Principal
                            </span>
                            <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">
                                Pastikan Setiap Dokumen Principal Terverifikasi
                            </h2>
                            <p className="mt-4 text-base leading-relaxed text-blue-100">
                                Telusuri dan verifikasi dokumen referensi milik
                                Principal yang telah terdaftar resmi dalam
                                sistem kami. Setiap dokumen memiliki reference
                                link unik untuk memastikan keaslian dan
                                validitasnya.
                            </p>
                            <Link
                                href="/reference-documents"
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-blue-700 transition hover:bg-blue-50"
                            >
                                Lihat Semua Dokumen
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                                        <ShieldCheck size={16} />
                                        Contoh Reference ID
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.active.color}`}
                                    >
                                        {statusConfig.active.label}
                                    </span>
                                </div>
                                <p className="mt-4 font-mono text-lg font-semibold text-white">
                                    ASPRI-PPK-48231
                                </p>
                                <div className="mt-4 flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2 text-xs text-blue-100">
                                    <Copy size={12} />
                                    <span className="truncate">
                                        https://aspri.example.com/verify/ASPRI-PPK-48231
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-white/10 p-5 text-center">
                                    <p className="text-2xl font-bold text-white">
                                        Unik
                                    </p>
                                    <p className="mt-1 text-xs text-blue-100">
                                        Reference ID berbeda untuk setiap
                                        dokumen
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-5 text-center">
                                    <p className="text-2xl font-bold text-white">
                                        Mudah
                                    </p>
                                    <p className="mt-1 text-xs text-blue-100">
                                        Salin link dan verifikasi kapan saja
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-5 text-center">
                                    <p className="text-2xl font-bold text-white">
                                        Aman
                                    </p>
                                    <p className="mt-1 text-xs text-blue-100">
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
