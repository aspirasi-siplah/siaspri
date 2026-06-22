import { Head } from '@inertiajs/react';

import LandingLayout from '@/layouts/landing-layout';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';

export default function ContactUs() {
    return (
        <>
            <Head title="Kontak Kami" />
            <LandingLayout>
                <section className="pt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold">Hubungi Kami</h1>

                            <p className="mt-4 text-lg text-slate-600">
                                Kami siap menerima pertanyaan, masukan, maupun
                                informasi lainnya.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="pb-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-12 lg:grid-cols-2">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Informasi Kontak
                                </h2>
                                <div className="mt-8 space-y-6">
                                    <div>
                                        <h3 className="font-semibold">
                                            Alamat
                                        </h3>

                                        <p className="text-slate-600">
                                            Jl. Contoh No. 123 Kota Surabaya
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email</h3>

                                        <p className="text-slate-600">
                                            info@example.com
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Telepon
                                        </h3>

                                        <p className="text-slate-600">
                                            +62 812-3456-7890
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-3xl border bg-white p-8">
                                <h2 className="mb-6 text-2xl font-bold">
                                    Lokasi Kantor Pusat
                                </h2>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d31657.880344630386!2d112.75141119999999!3d-7.32747685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1sid!2sid!4v1781497465009!5m2!1sid!2sid"
                                    width="100%"
                                    height="450"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}