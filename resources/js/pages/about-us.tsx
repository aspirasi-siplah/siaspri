import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Target } from 'lucide-react';
import LandingLayout from '@/layouts/landing-layout';

export default function AboutUs() {
    return (
        <>
            <Head title="Tentang Kami" />
            <LandingLayout>
                <section className="pt-32 pb-20">
                    <div className="mx-auto max-w-5xl px-6">
                        <div className="text-center">
                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                                Tentang Asosiasi
                            </span>
                            <h1 className="mt-16 text-4xl font-bold text-slate-900 md:text-5xl">
                                Mewujudkan Ekosistem Marketplace yang Aman,
                                Transparan, dan Terpercaya
                            </h1>
                        </div>
                        <p className="mt-10 text-lg text-slate-600">
                            Aspirasi (Asosiasi Pasar Daring Mitra SIPLah) adalah
                            wadah bagi Mitra SIPLah untuk bermusyawarah dan
                            berkomunikasi dalam meningkatkan kinerja layanan
                            serta mengatasi berbagai tantangan yang dihadapi.
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
                                Peran & Tujuan
                            </h2>
                            <p className="mx-auto mt-6 max-w-2xl text-slate-600">
                                Komitmen Aspirasi dalam membangun ekosistem
                                pasar daring yang sehat, transparan, dan
                                terpercaya.
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
                                            Peran
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Kontribusi Asosiasi dalam ekosistem
                                            pasar daring.
                                        </p>
                                    </div>
                                </div>
                                <div className="my-8 h-px bg-slate-100" />
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                                        <span className="leading-7 text-slate-600">
                                            Meningkatkan kualitas layanan dan
                                            kuantitas transaksi pada SIPLah
                                            Kemendikbudristek.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                                        <span className="leading-7 text-slate-600">
                                            Memperjuangkan kepentingan anggota
                                            dan industri pasar daring.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                                        <span className="leading-7 text-slate-600">
                                            Membina kerja sama dengan semua
                                            pihak yang berhubungan dengan pasar
                                            daring.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                                        <span className="leading-7 text-slate-600">
                                            Memprakarsai, mendorong dan ikut
                                            serta dalam kegiatan pasar daring.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                                        <span className="leading-7 text-slate-600">
                                            Mengadakan kegiatan yang sah serta
                                            tidak bertentangan dengan tujuan
                                            Asosiasi.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">
                                            Tujuan
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Arah bersama yang ingin dicapai.
                                        </p>
                                    </div>
                                </div>
                                <div className="my-8 h-px bg-slate-100" />
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Membangun hubungan kerjasama yang
                                            sehat dan berkelanjutan antar para
                                            anggotanya.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Menyelenggarakan kegiatan-kegiatan
                                            untuk peningkatan kualitas layanan
                                            dan keamanan dalam ekosistem pasar
                                            daring.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Menjadi wadah bagi anggota untuk
                                            berbagi pengalaman, pengetahuan, dan
                                            inovasi di bidang pasar daring.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Mewakili dan memperjuangkan
                                            kepentingan bersama anggota Asosiasi
                                            di tingkat nasional.
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                                        <span className="leading-7 text-slate-600">
                                            Menyelenggarakan program pelatihan
                                            dan pendidikan untuk meningkatkan
                                            kompetensi anggotanya.
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
