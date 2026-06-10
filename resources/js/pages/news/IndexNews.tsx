import LandingLayout from '@/layouts/landing-layout';
import Navbar from '@/components/landing/navbar';
import news from '@/routes/news';
import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/landing/footer';

interface News {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    published_at: string;
}

interface Props {
    listNews: {
        data: News[];
    };
}

export default function IndexNews({ listNews }: Props) {
    return (
        <>
            <Head title="Berita Kegiatan" />
            <LandingLayout>
                <section className="pt-32 pb-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold">
                                Berita Kegiatan
                            </h1>

                            <p className="mt-3 text-slate-600">
                                Informasi dan kegiatan terbaru yang telah
                                dilaksanakan.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {listNews.data.length > 0 ? (
                                listNews.data.map((item) => (
                                    <article
                                        key={item.id}
                                        className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="overflow-hidden">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>

                                        <div className="p-6">
                                            <p className="mb-2 text-sm text-slate-500">
                                                {item.published_at}
                                            </p>

                                            <h2 className="line-clamp-2 text-xl font-semibold">
                                                {item.title}
                                            </h2>

                                            <Link
                                                href={news.show(item.slug)}
                                                className="mt-5 inline-flex text-blue-600"
                                            >
                                                Baca Selengkapnya →
                                            </Link>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="col-span-full">
                                    <p className="text-center text-slate-500">
                                        Belum ada berita kegiatan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </LandingLayout>
        </>
    );
}
