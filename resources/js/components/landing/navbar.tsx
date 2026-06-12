import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth } = usePage().props as any;
    const location = usePage().url;

    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="text-xl font-bold text-blue-600">
                    SiAspri
                </Link>
                <nav className="hidden gap-8 md:flex">
                    <NavLink label="Beranda" href="/" active={location === '/'}/>
                    <NavLink label="Berita" href="/news" active={location === '/news'} />
                    <NavLink label="Blacklist" href="/blacklist" active={location === '/blacklist'} />
                    <NavLink label="Tentang" href="/about" active={location === '/about'} />
                    <NavLink label="Kontak" href="/contact" active={location === '/contact'} />
                </nav>
                {auth.user ? (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/news-management"
                            className="rounded-lg bg-blue-600 px-6 py-1.5 text-[13px] font-medium text-white"
                        >
                            Dashboard
                        </Link>
                    </div>
                ) : 
                (
                    <Link
                        href="/login"
                        className="rounded-lg bg-blue-600 px-6 py-1.5 text-[13px] font-medium text-white"
                    >
                        Masuk
                    </Link>
                )
                }
            </div>
        </header>
    );
}

const NavLink = ({ label, href, active }: { label: string; href: string, active?: boolean }) => {
    return (
        <Link
            href={href}
            className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'}`}
        >
            {label}
        </Link>
    );
};
