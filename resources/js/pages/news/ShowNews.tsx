import LandingLayout from '@/layouts/landing-layout';

import { Head, Link } from '@inertiajs/react';

import { CalendarDays, ArrowLeft, User, Images } from 'lucide-react';

interface NewsDocument {
    id: number;
    name: string;
    url: string;
}

interface News {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    excerpt: string | null;
    content: string;
    published_at: string;
    author?: string;
    documents: NewsDocument[];
}

interface Props {
    news: News;
}

export default function ShowNews({ news }: Props) {
    return (
        <>
            <Head title={news.title} />

            <LandingLayout>
                <article className="pt-32 pb-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <Link
                            href="/news"
                            className="mb-8 inline-flex items-center gap-2 text-sm text-primary"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Berita
                        </Link>

                        <div className="mb-12">
                            <div className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                Berita Kegiatan
                            </div>

                            <h1 className="text-4xl leading-tight font-bold md:text-5xl">
                                {news.title}
                            </h1>

                            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={16} />
                                    {news.published_at}
                                </div>

                                {news.author && (
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        {news.author}
                                    </div>
                                )}
                            </div>

                            {news.excerpt && (
                                <p className="mt-8 border-l-4 border-primary pl-5 text-lg leading-relaxed text-slate-600">
                                    {news.excerpt}
                                </p>
                            )}
                        </div>

                        {news.thumbnail && (
                            <div className="mb-14 overflow-hidden rounded-3xl shadow-lg">
                                <img
                                    src={news.thumbnail}
                                    alt={news.title}
                                    className="h-[500px] w-full object-cover"
                                />
                            </div>
                        )}

                        <div
                            className="prose prose-lg prose-headings:font-bold prose-img:rounded-2xl prose-img:shadow-md max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: news.content,
                            }}
                        />

                        {news.documents.length > 0 && (
                            <section className="mt-20">
                                <div className="mb-8 flex items-center gap-3">
                                    <Images size={24} />

                                    <h2 className="text-2xl font-bold">
                                        Dokumentasi Kegiatan
                                    </h2>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {news.documents.map((document) => (
                                        <figure
                                            key={document.id}
                                            className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
                                        >
                                            <img
                                                src={document.url}
                                                alt={document.name}
                                                className="h-64 w-full object-cover"
                                            />

                                            {document.name && (
                                                <figcaption className="p-4 text-sm text-slate-600">
                                                    {document.name}
                                                </figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className="mt-20 rounded-3xl border bg-slate-50 p-10 text-center">
                            <h3 className="text-2xl font-bold">
                                Ingin melihat kegiatan lainnya?
                            </h3>

                            <p className="mt-3 text-slate-600">
                                Temukan berbagai informasi, kegiatan, dan
                                program yang telah kami laksanakan.
                            </p>

                            <Link
                                href="/news"
                                className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-white"
                            >
                                Lihat Semua Berita
                            </Link>
                        </div>
                    </div>
                </article>
            </LandingLayout>
        </>
    );
}