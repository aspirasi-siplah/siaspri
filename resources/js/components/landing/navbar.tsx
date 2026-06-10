import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    SiAspri
                </Link>
                <nav className="hidden gap-8 md:flex">
                    <NavLink label="Beranda" href="/" />
                    <NavLink label="Berita" href="/news" />
                    <NavLink label="Tentang" href="/about" />
                    <NavLink label="Kontak" href="/contact" />
                </nav>
                <Link
                    href="/login"
                    className="rounded-lg bg-blue-600 px-6 py-1.5 text-[13px] font-medium text-white"
                >
                    Masuk
                </Link>
            </div>
        </header>
    );
}

const NavLink = ({ label, href }: { label: string; href: string }) => {
    return (
        <Link
            href={href}
            className="text-sm font-medium text-slate-700 hover:text-blue-600"
        >
            {label}
        </Link>
    );
};
