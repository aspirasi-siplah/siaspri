import { router } from '@inertiajs/react';

interface SimplePaginate {
    current_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    from: number;
    to: number;
}

interface PaginationProps {
    current_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    from: number;
    to: number;
    className?: string;
}

export default function Pagination({
    current_page,
    next_page_url,
    prev_page_url,
    per_page,
    from,
    to,
    className = '',
}: PaginationProps) {
    const goTo = (url: string | null) => {
        if (!url) return;
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div
            className={`flex flex-col items-center justify-between gap-4 md:flex-row ${className}`}
        >
            <div className="text-sm text-gray-500">
                Halaman{' '}
                <span className="font-semibold text-gray-700">
                    {current_page || 1}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => goTo(prev_page_url)}
                    disabled={!prev_page_url}
                    className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition ${
                        prev_page_url
                            ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                    }`}
                >
                    Sebelumnya
                </button>
                <div className="rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-semibold text-white shadow">
                    {current_page || 1}
                </div>
                <button
                    onClick={() => goTo(next_page_url)}
                    disabled={!next_page_url}
                    className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition ${
                        next_page_url
                            ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                    }`}
                >
                    Selanjutnya
                </button>
            </div>
        </div>
    );
}