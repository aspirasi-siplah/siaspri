import { Link } from '@inertiajs/react';
import { ArrowRight, Mail } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-32">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-sky-50 to-cyan-100" />

            <div className="relative mx-auto max-w-7xl px-6 py-24">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                            Platform Aspirasi
                        </span>
                        <h1 className="mt-6 text-4xl leading-tight font-extrabold text-slate-900 md:text-5xl">
                            Asosiasi Pasar Daring
                            <span className="text-blue-600"> Mitra SIPLah</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-600">
                            Platform Asosiasi Pasar Daring Mitra SIPLah
                            (Aspirasi) yang membantu masyarakat menyampaikan
                            masukan, serta memperoleh informasi secara
                            transparan dan terpercaya.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/news"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                            >
                                Lihat Kegiatan
                            </Link>
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg ring-1 ring-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-xl"
                            >
                                <Mail className="h-5 w-5" />
                                Hubungi Kami
                                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <img
                            src="/images/hero-1.png"
                            alt="hero"
                            className="w-full max-w-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
