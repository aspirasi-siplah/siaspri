import AppLayout from '@/layouts/app-layout';

import {
    Users,
    Eye,
    Newspaper,
    TrendingUp,
    Plus,
    ShieldAlert,
} from 'lucide-react';

import { Head, Link } from '@inertiajs/react';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from 'recharts';

interface Props {
    analytics: {
        stats: {
            totalVisitors: number;
            todayVisitors: number;
            pageViews: number;
            totalArticlesViews: number;
        };

        chart: {
            date: string;
            visitors: number;
        }[];

        topPages: {
            page: string;
            views: number;
        }[];
    };

    newsCount: number;
}

export default function Dashboard({ analytics, newsCount }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Dashboard',
                        href: '',
                    },
                ]}
            >
                <div className="space-y-8 p-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="mt-2 text-slate-500">
                            Ringkasan aktivitas website dan statistik
                            pengunjung.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            title="Total Kunjungan"
                            value={analytics.stats.totalVisitors}
                            icon={<Users size={24} />}
                        />
                        <StatCard
                            title="Kunjungan Hari Ini"
                            value={analytics.stats.todayVisitors}
                            icon={<TrendingUp size={24} />}
                        />
                        <StatCard
                            title="Halaman Dilihat"
                            value={analytics.stats.pageViews}
                            icon={<Eye size={24} />}
                        />
                        <StatCard
                            title="Jumlah Berita"
                            value={newsCount}
                            icon={<Newspaper size={24} />}
                        />
                    </div>
                    <div className="rounded-3xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-lg font-semibold">
                            Kunjungan 30 Hari Terakhir
                        </h2>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.chart}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="visitors" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="grid gap-6 xl:grid-cols-3">
                        <div className="rounded-3xl border bg-white p-6 shadow-sm xl:col-span-2">
                            <h2 className="mb-6 text-lg font-semibold">
                                Halaman Terpopuler
                            </h2>
                            <div className="overflow-hidden rounded-2xl border">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm">
                                                Halaman
                                            </th>

                                            <th className="px-4 py-3 text-right text-sm">
                                                Dilihat
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analytics.topPages.map(
                                            (page, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-t"
                                                >
                                                    <td className="px-4 py-4 text-sm">
                                                        {page.page}
                                                    </td>

                                                    <td className="px-4 py-4 text-right font-semibold">
                                                        {page.views}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="rounded-3xl border bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-lg font-semibold">
                                Aksi Cepat
                            </h2>
                            <div className="space-y-3">
                                <Link
                                    href="/news-management/create"
                                    className="flex items-center gap-3 rounded-2xl border p-4 transition hover:bg-slate-50"
                                >
                                    <Plus size={18} />
                                    <span>Tambah Berita</span>
                                </Link>
                                <Link
                                    href="/blacklist-merchants"
                                    className="flex items-center gap-3 rounded-2xl border p-4 transition hover:bg-slate-50"
                                >
                                    <ShieldAlert size={18} />
                                    <span>Tambah Merchant Blacklist</span>
                                </Link>
                                {/* <Link
                                    href="/website-settings"
                                    className="flex items-center gap-3 rounded-2xl border p-4 transition hover:bg-slate-50"
                                >
                                    <TrendingUp size={18} />
                                    <span>Pengaturan Website</span>
                                </Link> */}
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </h3>
                </div>

                <div className="rounded-2xl bg-sky-100 p-3 text-sky-800">{icon}</div>
            </div>
        </div>
    );
}