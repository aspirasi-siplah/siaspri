import { Head } from '@inertiajs/react';
import { Activity as ActivityIcon, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import CustomModal from '@/components/custom-components/CustomModal';
import CustomTable from '@/components/custom-components/CustomTable';
import Pagination from '@/components/custom-components/Pagination';
import AppLayout from '@/layouts/app-layout';

interface ActivityItem {
    id: number;
    description: string;
    event: string | null;
    module: string;
    causer_name: string;
    causer_email: string;
    changes: Record<string, any>;
    created_at: string;
}

interface PaginationProps {
    data: ActivityItem[];
    current_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    activities: PaginationProps;
}

const eventBadge: Record<string, string> = {
    created: 'bg-emerald-50 text-emerald-700',
    updated: 'bg-blue-50 text-blue-700',
    deleted: 'bg-red-50 text-red-700',
};

const eventLabel: Record<string, string> = {
    created: 'Membuat',
    updated: 'Memperbarui',
    deleted: 'Menghapus',
};

function formatValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '-';
    }

    if (typeof value === 'boolean') {
        return value ? 'Ya' : 'Tidak';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

function DetailModal({
    item,
    onClose,
}: {
    item: ActivityItem | null;
    onClose: () => void;
}) {
    const changes = item?.changes ?? {};
    const attributes = changes.attributes ?? {};
    const old = changes.old ?? {};
    const keys = Object.keys(attributes).filter((key) => key !== 'updated_at');

    return (
        <CustomModal
            open={!!item}
            onClose={onClose}
            title="Detail Aktivitas"
            size="lg"
        >
            {item && (
                <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Pengguna
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                                {item.causer_name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {item.causer_email}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Modul
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                                {item.module}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Aksi
                            </p>
                            <span
                                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    eventBadge[item.event ?? ''] ??
                                    'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {eventLabel[item.event ?? ''] ??
                                    item.description}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Waktu
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                                {item.created_at}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Detail Perubahan
                        </p>

                        {keys.length > 0 ? (
                            <div className="mt-3 space-y-2">
                                {keys.map((key) => (
                                    <div
                                        key={key}
                                        className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                                    >
                                        <div className="text-xs font-medium text-gray-500">
                                            <span className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-gray-600">
                                                {key}
                                            </span>
                                        </div>
                                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                                            {key in old && (
                                                <>
                                                    <span className="text-gray-400 line-through">
                                                        {formatValue(old[key])}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        →
                                                    </span>
                                                </>
                                            )}
                                            <span className="text-gray-800">
                                                {formatValue(attributes[key])}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-gray-500">
                                Tidak ada detail perubahan.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </CustomModal>
    );
}

export default function IndexLogActivity({ activities }: Props) {
    const [selected, setSelected] = useState<ActivityItem | null>(null);

    return (
        <>
            <Head title="Log Aktivitas" />
            <AppLayout breadcrumbs={[{ title: 'Log Aktivitas', href: '' }]}>
                <div className="space-y-6 p-12">
                    <div>
                        <h1 className="text-2xl font-bold">Log Aktivitas</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Riwayat aktivitas yang dilakukan oleh setiap
                            pengguna.
                        </p>
                    </div>

                    <CustomTable
                        title="Riwayat Aktivitas"
                        icon={
                            <ActivityIcon
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={['Pengguna', 'Modul', 'Waktu', 'Aksi']}
                        headerAlign={[
                            'text-left',
                            'text-left',
                            'text-left',
                            'text-center',
                        ]}
                    >
                        {activities.data.length > 0 ? (
                            activities.data.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                                                {item.causer_name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {item.causer_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.causer_email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {item.module}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                        {item.created_at}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() =>
                                                    setSelected(item)
                                                }
                                                className="inline-flex cursor-pointer items-center rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                                            >
                                                Detail
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-16 text-center text-sm text-gray-700"
                                >
                                    Belum ada aktivitas
                                </td>
                            </tr>
                        )}
                    </CustomTable>

                    <Pagination
                        current_page={activities.current_page}
                        next_page_url={activities.next_page_url}
                        prev_page_url={activities.prev_page_url}
                    />

                    <DetailModal
                        item={selected}
                        onClose={() => setSelected(null)}
                    />
                </div>
            </AppLayout>
        </>
    );
}