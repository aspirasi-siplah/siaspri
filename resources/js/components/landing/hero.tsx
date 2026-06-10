import { Link } from '@inertiajs/react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-32">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-sky-50 to-cyan-100" />

            <div className="relative mx-auto max-w-7xl px-6 py-24">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                            Platform Aspirasi Digital
                        </span>

                        <h1 className="mt-6 text-5xl leading-tight font-extrabold text-slate-900">
                            Suara Anda Membawa
                            <span className="text-blue-600"> Perubahan</span>
                        </h1>

                        <p className="mt-6 text-lg text-slate-600">
                            Sampaikan kritik, saran, ide, dan aspirasi dengan
                            mudah melalui platform digital yang transparan dan
                            terpercaya.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <Link
                                href="/aspirasi"
                                className="rounded-xl bg-blue-600 px-6 py-3 text-white"
                            >
                                Kirim Aspirasi
                            </Link>

                            <Link
                                href="/berita"
                                className="rounded-xl border px-6 py-3"
                            >
                                Lihat Kegiatan
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <img
                            src="/images/hero.svg"
                            alt="hero"
                            className="w-full max-w-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}