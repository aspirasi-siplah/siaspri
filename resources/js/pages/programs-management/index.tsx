import { Head, router } from '@inertiajs/react';
import { FileBadge, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import CustomTable from '@/components/custom-components/CustomTable';
import Pagination from '@/components/custom-components/Pagination';
import ModalForm from '@/components/programs-management/ModalForm';
import StatCard from '@/components/stat-card';
import AppLayout from '@/layouts/app-layout';
import programsManagement from '@/routes/programs-management';

interface Program {
    id: number;
    code: string;
    name: string;
    year: number;
    id_fund: string | null;
    principals_count: number;
    created_at: string | null;
}

interface Props {
    programs: {
        data: Program[];
        current_page: number;
        last_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        per_page: number;
        from: number;
        to: number;
    };
}

export default function Index({ programs }: Props) {
    const [search, setSearch] = useState('');

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(
            programsManagement.index.url(),
            { search: search.trim() },
            { preserveState: true, replace: true },
        );
    };

    const destroy = (id: number, name: string) => {
        Swal.fire({
            title: 'Hapus Program',
            text: `Anda akan menghapus program "${name}".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#a5a5a5',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Kembali',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(programsManagement.destroy.url(id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Program berhasil dihapus.',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: 'Program gagal dihapus.',
                        });
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Program / Banpem" />
            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Program / Banpem',
                        href: programsManagement.index(),
                    },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Program / Banpem
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola data program bantuan pemerintah beserta
                                principal terkait.
                            </p>
                        </div>
                        <ModalForm />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <StatCard
                            title="Total Program"
                            value={programs.total || 0}
                            icon={<FileBadge size={24} />}
                        />
                    </div>

                    <form
                        onSubmit={submit}
                        className="flex items-center gap-3 rounded-2xl border bg-slate-50/60 px-4 py-2.5 lg:w-1/2"
                    >
                        <Search size={16} className="shrink-0 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kode atau nama program..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                    </form>

                    <CustomTable
                        title="Daftar Program"
                        icon={
                            <FileBadge
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={[
                            'Program',
                            'Tahun',
                            'ID Fund',
                            'Principal',
                            'Aksi',
                        ]}
                        headerAlign={[
                            'text-left',
                            'text-center',
                            'text-left',
                            'text-center',
                            'text-center',
                        ]}
                    >
                        {programs.data.length ? (
                            programs.data.map((program) => (
                                <tr key={program.id} className="border-t">
                                    <td className="max-w-64 px-4 py-1">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium">
                                                {program.name}
                                            </p>
                                            <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                                                {program.code}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-1 text-center text-sm font-medium text-gray-700">
                                        {program.year}
                                    </td>
                                    <td className="max-w-56 px-4 py-1 text-sm text-gray-600">
                                        <span
                                            className="block truncate"
                                            title={program.id_fund ?? ''}
                                        >
                                            {program.id_fund || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-1 text-center text-sm text-gray-600">
                                        {program.principals_count}
                                    </td>
                                    <td className="px-4 py-1">
                                        <div className="flex justify-center gap-2">
                                            <ModalForm program={program} />
                                            <button
                                                onClick={() =>
                                                    destroy(
                                                        program.id,
                                                        program.name,
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                                <span className="sr-only">
                                                    Hapus
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-16 text-center text-sm text-gray-700"
                                >
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </CustomTable>
                    <Pagination
                        current_page={programs.current_page}
                        next_page_url={programs.next_page_url}
                        prev_page_url={programs.prev_page_url}
                    />
                </div>
            </AppLayout>
        </>
    );
}
