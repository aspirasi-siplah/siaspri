// components/landing/partners-section.tsx

const partners = [
    {
        name: 'Toko Ladang',
        logo: '/images/siplah/tokoladang.png',
    },
    {
        name: 'Eureka Bookhouse',
        logo: '/images/siplah/eureka.png',
    },
    {
        name: 'Telkom',
        logo: '/images/siplah/telkom.png',
    },
    {
        name: 'Blibli',
        logo: '/images/siplah/blibli.png',
    },
    {
        name: 'Gramedia',
        logo: '/images/siplah/gramedia.png',
    },
    {
        name: 'Intan Pariwara',
        logo: '/images/siplah/intan-pariwara.png',
    },
    {
        name: 'Masmedia',
        logo: '/images/siplah/masmedia.png',
    },
    {
        name: 'Temprina',
        logo: '/images/siplah/temprina.png',
    },
];

export default function PartnersSection() {
    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        Mitra Kami
                    </span>
                    <h2 className="mt-6 text-3xl font-bold">
                        Dipercaya dan Didukung Berbagai Mitra
                    </h2>
                    <p className="mt-4 text-base text-slate-500">
                        Kami bekerja sama dengan berbagai organisasi, komunitas,
                        dan pelaku usaha untuk menciptakan ekosistem aspirasi
                        yang transparan dan bermanfaat bagi masyarakat.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="group flex flex-col h-36 items-center justify-center rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="max-h-16 w-auto object-contain"
                            />
                            <p className="mt-4 text-[13px] font-medium text-slate-500">
                                {partner.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}