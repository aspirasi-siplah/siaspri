import { Head } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import LandingLayout from '@/layouts/landing-layout';

export default function ContactUs() {
    return (
        <>
            <Head title="Kontak Kami" />
            <LandingLayout>
                <section className="pt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold md:text-5xl">
                                Hubungi Kami
                            </h1>
                        </div>
                        <p className="mt-4 text-center text-lg text-slate-600">
                            Kami siap menerima pertanyaan, masukan, maupun
                            informasi lainnya.
                        </p>
                    </div>
                </section>
                <section className="pb-24">
                    <div className="mx-auto max-w-2xl px-6">
                        <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
                            <h2 className="text-2xl font-bold">
                                Informasi Kontak
                            </h2>
                            <div className="mt-8 flex items-center justify-center gap-3">
                                <Mail
                                    size={20}
                                    className="shrink-0 text-blue-600"
                                />
                                <a
                                    href="mailto:Info.siaspri@gmail.com"
                                    className="text-lg font-medium text-slate-700 hover:text-blue-600"
                                >
                                    Info.siaspri@gmail.com
                                </a>
                            </div>
                            <a
                                href="mailto:Info.siaspri@gmail.com"
                                className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                            >
                                Kirim Email
                            </a>
                        </div>
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}
