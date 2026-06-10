const stats = [
    {
        label: 'Aspirasi Masuk',
        value: '1.250+',
    },
    {
        label: 'Diproses',
        value: '1.100+',
    },
    {
        label: 'Kegiatan',
        value: '75+',
    },
    {
        label: 'Respon',
        value: '98%',
    },
];

export default function Stats() {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-6 md:grid-cols-4">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl bg-white p-8 text-center shadow"
                        >
                            <h3 className="text-4xl font-bold text-blue-600">
                                {item.value}
                            </h3>

                            <p className="mt-2 text-slate-500">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
