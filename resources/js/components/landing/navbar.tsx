import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { auth } = usePage().props as any;
    const location = usePage().url;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    <img src="/images/logo.png" alt="" className="h-15" />
                </Link>

                <nav className="hidden gap-8 md:flex">
                    <NavLink
                        label="Beranda"
                        href="/"
                        active={location === '/'}
                    />
                    <NavLink
                        label="Berita"
                        href="/news"
                        active={location.startsWith('/news')}
                    />
                    <NavLink
                        label="Blacklist"
                        href="/blacklist"
                        active={location.startsWith('/blacklist')}
                    />
                    <NavLink
                        label="Principal"
                        href="/principals"
                        active={location.startsWith('/principals')}
                    />
                    <NavLink
                        label="Tentang"
                        href="/about"
                        active={location === '/about'}
                    />
                    <NavLink
                        label="Kontak"
                        href="/contact"
                        active={location === '/contact'}
                    />
                </nav>

                <div className="hidden items-center gap-4 md:flex">
                    {auth.user ? (
                        <Link
                            href="/dashboard"
                            className="rounded-lg bg-blue-600 px-6 py-1.5 text-[13px] font-medium text-white"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="rounded-lg bg-blue-600 px-6 py-1.5 text-[13px] font-medium text-white"
                        >
                            Masuk
                        </Link>
                    )}
                </div>

                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="cursor-pointer rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                    aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
                    mobileOpen
                        ? 'max-h-96 border-t border-slate-100'
                        : 'max-h-0'
                }`}
            >
                <nav className="flex flex-col gap-1 px-6 py-4">
                    <MobileNavLink
                        label="Beranda"
                        href="/"
                        active={location === '/'}
                        onClick={() => setMobileOpen(false)}
                    />
                    <MobileNavLink
                        label="Berita"
                        href="/news"
                        active={location.startsWith('/news')}
                        onClick={() => setMobileOpen(false)}
                    />
                    <MobileNavLink
                        label="Blacklist"
                        href="/blacklist"
                        active={location.startsWith('/blacklist')}
                        onClick={() => setMobileOpen(false)}
                    />
                    <MobileNavLink
                        label="Principal"
                        href="/principals"
                        active={location.startsWith('/principals')}
                        onClick={() => setMobileOpen(false)}
                    />
                    <MobileNavLink
                        label="Tentang"
                        href="/about"
                        active={location === '/about'}
                        onClick={() => setMobileOpen(false)}
                    />
                    <MobileNavLink
                        label="Kontak"
                        href="/contact"
                        active={location === '/contact'}
                        onClick={() => setMobileOpen(false)}
                    />

                    <div className="my-2 border-t border-slate-100" />

                    {auth.user ? (
                        <Link
                            href="/dashboard"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                        >
                            Masuk
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}

const NavLink = ({
    label,
    href,
    active,
}: {
    label: string;
    href: string;
    active?: boolean;
}) => {
    return (
        <Link
            href={href}
            className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
        >
            {label}
        </Link>
    );
};

const MobileNavLink = ({
    label,
    href,
    active,
    onClick,
}: {
    label: string;
    href: string;
    active?: boolean;
    onClick: () => void;
}) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
            }`}
        >
            {label}
        </Link>
    );
};
