import { Link } from "@inertiajs/react";
import { ArrowRight, Image } from "lucide-react";

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
                            {item.thumbnail ? (
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="h-56 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-56 w-full flex-col items-center justify-center bg-slate-100">
                                    <Image
                                        size={48}
                                        className="text-slate-300"
                                    />
                                    <p className="mt-2 text-xs font-medium text-slate-400">
                                        Tidak ada gambar
                                    </p>
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="font-bold">{item.title}</h3>
                                <Link
                                    href={`/news/${item.slug}`}
                                    className="mt-4 flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600"
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