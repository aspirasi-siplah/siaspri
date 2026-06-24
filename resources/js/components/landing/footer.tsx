import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin, MessageSquareText } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-slate-950 text-white">
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h3 className="text-2xl font-bold">Si E-Aspri</h3>
                        <p className="mt-4 text-sm leading-7 text-slate-400">
                            Platform Asosiasi Pasar Daring Mitra SIPLah
                            (Aspirasi) yang membantu masyarakat menyampaikan
                            masukan, pengaduan, serta memperoleh informasi
                            secara transparan dan terpercaya.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-sm text-slate-300">
                            <MessageSquareText size={16} />
                            Aspirasi Digital Terpercaya
                        </div>
                    </div>
                    <div>
                        <h4 className="mb-4 text-lg font-semibold">Menu</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li>
                                <Link href="/" className="hover:text-white">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-white"
                                >
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="hover:text-white">
                                    Berita Kegiatan
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blacklist"
                                    className="hover:text-white"
                                >
                                    Blacklist Merchant
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="hover:text-white"
                                >
                                    Kontak Kami
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-lg font-semibold">Layanan</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li>
                                <a href="#">Siplah Tokoladang</a>
                            </li>
                            <li>
                                <a href="#">Siplah Blibli</a>
                            </li>
                            <li>
                                <a href="#">Siplah Telkom</a>
                            </li>
                            <li>
                                <a href="#">Siplah Eureka</a>
                            </li>
                            <li>
                                <a href="#">Siplah Gramedia</a>
                            </li>
                            <li>
                                <a href="#">Siplah Intan Pariwara</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-lg font-semibold">
                            Hubungi Kami
                        </h4>
                        <div className="space-y-4 text-slate-400">
                            <div className="flex gap-3">
                                <MapPin size={18} className="mt-1 shrink-0" />

                                <span>Surabaya, Jawa Timur, Indonesia</span>
                            </div>
                            <div className="flex gap-3">
                                <Mail size={18} className="shrink-0" />

                                <span>info@aspirasiku.id</span>
                            </div>
                            <div className="flex gap-3">
                                <Phone size={18} className="shrink-0" />

                                <span>+62 812 3456 7890</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-800 pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
                        <p>
                            © {new Date().getFullYear()} AspirasiKu. Seluruh hak
                            cipta dilindungi.
                        </p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-white">
                                Kebijakan Privasi
                            </Link>
                            <Link href="#" className="hover:text-white">
                                Syarat & Ketentuan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}