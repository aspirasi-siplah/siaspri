
interface Props {
    stats: {
        totalBlacklistMerchant: number;
        totalNews: number;
    };
}

export default function Stats({ stats }: Props) {

    return (
        <section className="py-16">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-8 text-center shadow">
                        <h3 className="text-4xl font-bold text-blue-600">
                            {stats.totalNews}
                        </h3>

                        <p className="mt-2 text-slate-500 font-medium text-[15px]">Berita Kegiatan</p>
                    </div>
                    <div className="rounded-2xl bg-white p-8 text-center shadow">
                        <h3 className="text-4xl font-bold text-blue-600">
                            {stats.totalBlacklistMerchant}
                        </h3>

                        <p className="mt-2 text-slate-500 font-medium text-[15px]">Blacklist Merchant</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
