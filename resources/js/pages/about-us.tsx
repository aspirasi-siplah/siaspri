import { Head, Link } from '@inertiajs/react';

import LandingLayout from '@/layouts/landing-layout';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

export default function AboutUs() {
    return (
        <>
            <Head title="Tentang Kami" />

            <LandingLayout>
                <section className="pt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                                Tentang Platform
                            </span>

                            <h1 className="mt-6 text-5xl font-bold text-slate-900">
                                Membangun Komunikasi yang Lebih Transparan
                            </h1>

                            <p className="mt-6 text-lg text-slate-600">
                                Platform ini hadir sebagai sarana penyampaian
                                aspirasi, kritik, saran, dan masukan secara
                                terbuka, mudah, dan bertanggung jawab.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-20">
                    <div className="mx-auto max-w-5xl px-6">
                        <h2 className="text-3xl font-bold">Tentang Platform</h2>

                        <p className="mt-6 leading-8 text-slate-600">
                            Website ini dibangun untuk menjembatani komunikasi
                            antara masyarakat dengan organisasi. Melalui sistem
                            digital yang modern, setiap masukan dapat
                            tersampaikan secara efektif dan ditindaklanjuti
                            dengan lebih transparan.
                        </p>
                    </div>
                </section>

                <section className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="rounded-3xl bg-white p-10 shadow-sm">
                                <h3 className="text-2xl font-bold">Visi</h3>

                                <p className="mt-4 text-slate-600">
                                    Menjadi platform komunikasi aspirasi yang
                                    terpercaya, transparan, dan berdampak
                                    positif bagi seluruh pihak.
                                </p>
                            </div>

                            <div className="rounded-3xl bg-white p-10 shadow-sm">
                                <h3 className="text-2xl font-bold">Misi</h3>

                                <ul className="mt-4 space-y-3 text-slate-600">
                                    <li>
                                        Menyediakan kanal aspirasi yang mudah
                                        diakses.
                                    </li>

                                    <li>
                                        Menjamin transparansi pengelolaan
                                        aspirasi.
                                    </li>

                                    <li>
                                        Meningkatkan partisipasi masyarakat.
                                    </li>

                                    <li>
                                        Mendukung budaya komunikasi yang sehat.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">
                                Nilai-Nilai Kami
                            </h2>
                        </div>

                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            <div className="rounded-3xl border bg-white p-8">
                                <h3 className="font-semibold">Transparansi</h3>

                                <p className="mt-3 text-slate-600">
                                    Setiap aspirasi diproses dengan keterbukaan.
                                </p>
                            </div>

                            <div className="rounded-3xl border bg-white p-8">
                                <h3 className="font-semibold">Akuntabilitas</h3>

                                <p className="mt-3 text-slate-600">
                                    Semua masukan ditindaklanjuti secara
                                    bertanggung jawab.
                                </p>
                            </div>

                            <div className="rounded-3xl border bg-white p-8">
                                <h3 className="font-semibold">Kolaborasi</h3>

                                <p className="mt-3 text-slate-600">
                                    Mendorong keterlibatan aktif semua pihak.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-to-r from-blue-600 to-sky-500 py-20 text-white">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h2 className="text-4xl font-bold">
                            Punya Aspirasi untuk Disampaikan?
                        </h2>

                        <p className="mt-4 text-lg text-blue-100">
                            Jadilah bagian dari perubahan yang lebih baik.
                        </p>

                        <Link
                            href="/aspirasi"
                            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-medium text-blue-600"
                        >
                            Kirim Aspirasi
                        </Link>
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}