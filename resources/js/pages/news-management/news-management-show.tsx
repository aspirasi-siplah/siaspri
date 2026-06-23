import AppLayout from '@/layouts/app-layout';

import { Head, Link } from '@inertiajs/react';

import {
    ArrowLeft,
    Pencil,
    Calendar,
    User,
    Link2,
    ImageIcon,
} from 'lucide-react';

interface NewsDocument {
    id: number;
    name: string;
    file_name: string;
    file_path: string;
}

interface NewsShow {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    excerpt: string | null;
    content: string;
    status: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    documents: NewsDocument[];
    categories: any[];
}


interface Props {
    news: NewsShow;
}

export default function ShowNews({ news }: Props) {
    const statusLabels = {
        draft: {
            label: 'Draf',
            color: ' bg-yellow-100 text-yellow-700',
        },
        published: {
            label: 'Diterbitkan',
            color: ' bg-green-100 text-green-700',
        },
        archived: {
            label: 'Arsip',
            color: ' bg-gray-100 text-gray-700',
        },
    } as any;

    return (
        <>
            <Head title={news.title} />

            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Manajemen Berita',
                        href: '/news-management',
                    },
                    {
                        title: 'Detail Berita',
                        href: '',
                    },
                ]}
            >
                <div className="space-y-8 p-12">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{news.title}</h1>
                            <div className="mt-3 flex gap-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-sm ${statusLabels[news.status].color ?? ''}`}
                                >
                                    {statusLabels[news.status].label ?? 'Draf'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/news-management"
                                className="rounded-xl border px-4 py-2"
                            >
                                <ArrowLeft size={16} />
                            </Link>
                            <Link
                                href={`/news-management/${news.id}/edit`}
                                className="rounded-xl bg-primary px-4 py-2 text-white"
                            >
                                <Pencil size={16} />
                            </Link>
                        </div>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            {news.thumbnail ? (
                                <img
                                    src={news.thumbnail}
                                    alt={news.title}
                                    className="w-full rounded-2xl border"
                                />
                            ) : (
                                <div className="flex h-72 items-center justify-center rounded-2xl border">
                                    <ImageIcon />
                                </div>
                            )}
                        </div>
                        <div className="space-y-4 rounded-2xl border p-6 lg:col-span-2">
                            <div className="flex items-center gap-3">
                                {news.categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="rounded-full bg-muted text-gray-700 px-6 py-1.5 text-sm"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar size={18} />
                                <span>{news.published_at}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link2 size={18} />
                                <span>{news.slug}</span>
                            </div>
                            {news.excerpt && (
                                <div className="rounded-xl bg-muted p-4">
                                    <p>{news.excerpt}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="rounded-2xl border p-8">
                        <h2 className="mb-6 text-xl font-semibold">
                            Konten Berita
                        </h2>
                        <div
                            className="prose max-w-none prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{
                                __html: news.content,
                            }}
                        />
                    </div>
                    <div className="rounded-2xl border p-8">
                        <h2 className="mb-6 text-xl font-semibold">
                            Dokumentasi Kegiatan
                        </h2>
                        {news.documents.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {news.documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="overflow-hidden rounded-xl border"
                                    >
                                        <img
                                            src={document.file_path}
                                            alt={document.name}
                                            className="h-48 w-full object-cover"
                                        />
                                        <div className="p-3">
                                            <p className="font-medium">
                                                {document.name}
                                            </p>
                                            <p className="text-xs text-wrap break-all text-muted-foreground">
                                                {document.file_name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                                Belum ada dokumentasi
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border p-8">
                        <h2 className="mb-6 text-xl font-semibold">Metadata</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    ID
                                </p>

                                <p>{news.id}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Created At
                                </p>

                                <p>{news.created_at}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Updated At
                                </p>

                                <p>{news.updated_at}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Slug
                                </p>

                                <p>{news.slug}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
