import { Link } from "@inertiajs/react";
import { ArrowRight } from "lucide-react";

interface News {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    published_at: string;
}

export default function LatestNews({ news }: { news: News[] }) {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="text-3xl font-bold">Berita Kegiatan Terbaru</h2>

                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    {news.map((item) => (
                        <article
                            key={item.id}
                            className="overflow-hidden rounded-2xl bg-white shadow"
                        >
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="h-56 w-full object-cover"
                            />
                            <div className="p-6">
                                <h3 className="font-bold">{item.title}</h3>
                                <Link
                                    href={`/news/${item.slug}`}
                                    className="mt-4 text-gray-500 hover:text-blue-600 flex items-center gap-1 font-medium text-sm"
                                >
                                    Baca Selengkapnya
                                    <ArrowRight size={16} className="" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}