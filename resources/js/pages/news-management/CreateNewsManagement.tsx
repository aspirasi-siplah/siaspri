import NewsForm from "@/components/news-management/news-form";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function CreateNewsManagement() {
    return (
        <>
            <Head title="Tambah Berita" />

            <AppLayout
                breadcrumbs={[
                    { title: 'Manajemen Berita', href: '/news-management' },
                    { title: 'Tambah Berita', href: '' },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Tambah Berita</h1>
                        <Link
                            href={'/news-management'}
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Link>
                    </div>
                    <NewsForm submitUrl={`news-management`} />
                </div>
            </AppLayout>
        </>
    );
}
