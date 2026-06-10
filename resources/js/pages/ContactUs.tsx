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
                                    Kirim Pesan
                                </h2>
                                <form className="space-y-5">
                                    <input
                                        type="text"
                                        placeholder="Nama"
                                        className="w-full rounded-xl border p-3"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="w-full rounded-xl border p-3"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subjek"
                                        className="w-full rounded-xl border p-3"
                                    />
                                    <textarea
                                        rows={5}
                                        placeholder="Pesan"
                                        className="w-full rounded-xl border p-3"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full rounded-xl bg-blue-600 py-3 text-white"
                                    >
                                        Kirim Pesan
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}