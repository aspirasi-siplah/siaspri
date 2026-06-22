import LandingLayout from '@/layouts/landing-layout';
import news from '@/routes/news';

import { Head, Link } from '@inertiajs/react';

import { CalendarDays, ArrowRight, Newspaper } from 'lucide-react';

interface News {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    excerpt?: string;
    published_at: string;
}

interface Props {
    listNews: {
        data: News[];
    };
}

export default function IndexNews({ listNews }: Props) {
    const featured = listNews.data[0];
    const remaining = listNews.data.slice(1);

    return (
        <>
            <Head title="Berita Kegiatan" />

            <LandingLayout>
                <section className="bg-gradient-to-b from-slate-50 to-white pt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                <Newspaper size={16} />
                                Pusat Informasi
                            </div>

                            <h1 className="mt-6 text-5xl leading-tight font-bold">
                                Berita & Kegiatan
                            </h1>

                            <p className="mt-6 text-lg text-slate-600">
                                Dokumentasi kegiatan, program, dan berbagai
                                informasi terbaru yang telah kami laksanakan.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="pb-24">
                    <div className="mx-auto max-w-7xl px-6">
                        {featured && (
                            <div className="mb-16">
                                <h2 className="mb-6 text-2xl font-bold">
                                    Berita Terbaru
                                </h2>
                                <Link
                                    href={news.show(featured.slug)}
                                    className="group grid overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-xl lg:grid-cols-2"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={featured.thumbnail}
                                            alt={featured.title}
                                            className="h-full w-full max-h-120 object-cover transition duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center p-10">
                                        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                                            <CalendarDays size={16} />
                                            {featured.published_at}
                                        </div>

                                        <h3 className="text-3xl leading-tight font-bold">
                                            {featured.title}
                                        </h3>

                                        {featured.excerpt && (
                                            <p className="mt-5 line-clamp-4 text-slate-600">
                                                {featured.excerpt}
                                            </p>
                                        )}

                                        <div className="mt-8 inline-flex items-center gap-2 font-medium text-primary">
                                            Baca Selengkapnya
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                Berita Lainnya
                            </h2>
                            <span className="text-sm text-slate-500">
                                {listNews.data.length} Artikel
                            </span>
                        </div>
                        {remaining.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                {remaining.map((item) => (
                                    <article
                                        key={item.id}
                                        className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <Link href={news.show(item.slug)}>
                                            <div className="overflow-hidden">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>

                                            <div className="p-6">
                                                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                                                    <CalendarDays size={14} />
                                                    {item.published_at}
                                                </div>

                                                <h3 className="line-clamp-2 text-xl font-semibold">
                                                    {item.title}
                                                </h3>

                                                {item.excerpt && (
                                                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                                                        {item.excerpt}
                                                    </p>
                                                )}

                                                <div className="mt-5 inline-flex items-center gap-2 text-primary">
                                                    Baca Selengkapnya
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-3xl border border-dashed p-16 text-center">
                                <h3 className="text-xl font-semibold">
                                    Belum Ada Berita
                                </h3>

                                <p className="mt-2 text-slate-500">
                                    Saat ini belum ada berita yang dapat
                                    ditampilkan.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}