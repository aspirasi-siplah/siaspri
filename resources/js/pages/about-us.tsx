import { Head, Link } from '@inertiajs/react';
import LandingLayout from '@/layouts/landing-layout';
import { CheckCircle2, Target } from 'lucide-react';

export default function AboutUs() {
    return (
        <>
            <Head title="Tentang Kami" />
            <LandingLayout>
                <section className="pt-32 pb-20">
                    <div className="mx-auto max-w-5xl px-6 text-center">
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                            Tentang Asosiasi
                        </span>
                        <h1 className="mt-16 text-5xl font-bold text-slate-900">
                            Mewujudkan Ekosistem Marketplace yang Aman,
                            Transparan, dan Terpercaya
                        </h1>
                        <p className="mt-32 text-lg text-slate-600">
                            Asosiasi Marketplace Indonesia hadir sebagai wadah
                            informasi, edukasi, dan kolaborasi antar pelaku
                            marketplace, sekaligus menyediakan data merchant
                            yang terindikasi melakukan pelanggaran untuk
                            meningkatkan keamanan transaksi digital.
                        </p>
                    </div>
                </section>
                <section className="bg-white py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <h2 className="text-3xl font-bold">
                            Tentang Asosiasi Marketplace Indonesia
                        </h2>
                        <p className="mt-12 max-w-5xl leading-8 text-slate-600">
                            Website ini merupakan media resmi Asosiasi
                            Marketplace Indonesia yang bertujuan menyediakan
                            informasi terpercaya seputar perkembangan industri
                            marketplace, publikasi berita, edukasi bagi pelaku
                            usaha, serta daftar merchant yang telah dikenai
                            sanksi atau masuk dalam blacklist berdasarkan hasil
                            verifikasi dan ketentuan yang berlaku.
                        </p>
                        <p className="mt-10 max-w-5xl leading-8 text-slate-600">
                            Melalui platform ini, kami berharap dapat
                            meningkatkan kepercayaan antara penjual, pembeli,
                            dan penyedia layanan marketplace sehingga tercipta
                            ekosistem perdagangan digital yang sehat,
                            profesional, dan berintegritas.
                        </p>
                    </div>
                </section>
                <section className="bg-slate-50 py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-12 text-center">
                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                                Arah Organisasi
                            </span>
                            <h2 className="mt-12 text-4xl font-bold text-slate-900">
                                Visi & Misi
                            </h2>
                            <p className="mx-auto mt-6 max-w-2xl text-slate-600">
                                Komitmen Asosiasi Marketplace Indonesia dalam
                                membangun ekosistem perdagangan digital yang
                                aman, transparan, profesional, dan terpercaya.
                            </p>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                        <Target className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            Visi
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Tujuan jangka panjang organisasi.
                                        </p>
                                    </div>
                                </div>
                                <div className="my-8 h-px bg-slate-100" />
                                <p className="leading-8 text-slate-600">
                                    Menjadi pusat informasi dan referensi
                                    terpercaya dalam mendukung terciptanya
                                    ekosistem marketplace Indonesia yang aman,
                                    transparan, profesional, dan berdaya saing.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            Misi
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Langkah nyata untuk mewujudkan visi.
                                        </p>
                                    </div>
                                </div>
                                <div className="my-8 h-px bg-slate-100" />
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Menyediakan informasi dan berita
                                            terkini mengenai perkembangan
                                            industri marketplace.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Meningkatkan literasi digital
                                            melalui edukasi bagi merchant dan
                                            masyarakat.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Menyediakan informasi merchant yang
                                            masuk daftar blacklist sebagai
                                            bentuk perlindungan bagi pengguna.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Mendorong terciptanya praktik
                                            perdagangan digital yang adil,
                                            transparan, dan bertanggung jawab.
                                        </span>
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
                                    Menyampaikan informasi secara terbuka dan
                                    dapat dipertanggungjawabkan.
                                </p>
                            </div>
                            <div className="rounded-3xl border bg-white p-8">
                                <h3 className="font-semibold">Integritas</h3>
                                <p className="mt-3 text-slate-600">
                                    Menjunjung tinggi kejujuran,
                                    profesionalisme, dan etika dalam setiap
                                    publikasi informasi.
                                </p>
                            </div>
                            <div className="rounded-3xl border bg-white p-8">
                                <h3 className="font-semibold">Perlindungan</h3>
                                <p className="mt-3 text-slate-600">
                                    Mendukung terciptanya transaksi digital yang
                                    aman bagi seluruh pelaku marketplace.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-gradient-to-r from-blue-600 to-sky-500 py-20 text-white">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h2 className="text-4xl font-bold">
                            Bersama Membangun Marketplace Indonesia yang Lebih
                            Baik
                        </h2>
                        <p className="mt-4 text-lg text-blue-100">
                            Dapatkan berita terbaru, informasi merchant
                            blacklist, dan berbagai edukasi seputar dunia
                            marketplace dalam satu platform.
                        </p>
                        <Link
                            href="/news"
                            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-medium text-blue-600"
                        >
                            Lihat Berita Terbaru
                        </Link>
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}