import NewsForm from '@/components/news-management/news-form';
import AppLayout from '@/layouts/app-layout';

import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface ExistingNewsDocument {
    id: number;
    name: string;
    file_name: string;
    file_path: string;
    url: string;
}

export interface NewsData {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    thumbnail_url?: string | null;
    documents?: ExistingNewsDocument[];
}

interface Props {
    news?: NewsData;
}

export default function NewsManagementFormPage({ news }: Props) {
    const isEdit = !!news;

    return (
        <>
            <Head title={isEdit ? 'Edit Berita' : 'Tambah Berita'} />

            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Manajemen Berita',
                        href: '/news-management',
                    },
                    {
                        title: isEdit ? 'Edit Berita' : 'Tambah Berita',
                        href: '',
                    },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {isEdit ? 'Edit Berita' : 'Tambah Berita'}
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {isEdit
                                    ? 'Perbarui informasi berita.'
                                    : 'Buat berita baru untuk dipublikasikan.'}
                            </p>
                        </div>

                        <Link
                            href="/news-management"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Link>
                    </div>
                    <NewsForm
                        news={news}
                        method={isEdit ? 'put' : 'post'}
                        submitUrl={
                            isEdit
                                ? `/news-management/${news.id}`
                                : `/news-management`
                        }
                    />
                </div>
            </AppLayout>
        </>
    );
}