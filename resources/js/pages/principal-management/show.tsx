import { Head, router } from '@inertiajs/react';
import {
    BadgeCheck,
    Building2,
    Download,
    Eye,
    FileText,
    Hash,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Pagination from '@/components/custom-components/Pagination';
import DocumentFormModal from '@/components/principal-management/DocumentFormModal';
import ResellerDetailModal from '@/components/principal-management/ResellerDetailModal';
import ResellerFormModal from '@/components/principal-management/ResellerFormModal';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import principalManagement from '@/routes/principal-management';
import documents from '@/routes/principal-management/documents';
import resellers from '@/routes/principal-management/resellers';

type Reseller = {
    id: number;
    name: string;
    npwp_number: string | null;
    document_number: string | null;
    document_path: string | null;
    reference_code: string | null;
    reference_link: string | null;
};
type Resellers = {
    data: Reseller[];
    current_page: number;
    last_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};
type PrincipalDocument = {
    id: number;
    name: {
        value: string;
        label: string;
    };
    path: string;
};
type Principal = {
    id: number;
    name: string;
    notes: string | null;
    npwp_number: string | null;
    nib: string | null;
    resellers_total: number;
    resellers: Resellers;
    documents: PrincipalDocument[];
};

type PrincipalDocumentType = {
    value: string;
    label: string;
};

export default function Show({ principal, document_types }: { principal: Principal, document_types: PrincipalDocumentType[] }) {
    const [editingReseller, setEditingReseller] = useState<Reseller | null>(
        null,
    );
    const [editingDocument, setEditingDocument] =
        useState<PrincipalDocument | null>(null);
    const [resellerModalOpen, setResellerModalOpen] = useState(false);
    const [documentModalOpen, setDocumentModalOpen] = useState(false);
    const [viewingReseller, setViewingReseller] =
        useState<Reseller | null>(null);
    const [search, setSearch] = useState('');
    const initial = useRef(true);

    useEffect(() => {
        if (initial.current) {
            initial.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                principalManagement.show(principal.id),
                { search: search.trim(), page: 1 },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['principal'],
                },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, principal.id]);

    const remove = (url: string, label: string) => {
        Swal.fire({
            title: 'Hapus Data',
            text: `Anda akan menghapus ${label} ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#a5a5a5',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Kembali',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(url, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: `${label} berhasil dihapus.`,
                        });
                    },
                });
            }
        });
    };

    const infoItems = [
        {
            icon: Hash,
            label: 'NPWP',
            value: principal.npwp_number || '-',
        },
        {
            icon: Building2,
            label: 'NIB',
            value: principal.nib || '-',
        },
        {
            icon: FileText,
            label: 'Dokumen',
            value: `${principal.documents.length} file`,
        },
        {
            icon: UserRound,
            label: 'Reseller',
            value: `${principal.resellers_total} reseller`,
        },
    ];

    return (
        <>
            <Head title={principal.name} />
            <AppLayout
                breadcrumbs={[
                    { title: 'Principal', href: principalManagement.index() },
                    {
                        title: principal.name,
                        href: principalManagement.show(principal.id),
                    },
                ]}
            >
                <div className="space-y-8 p-12">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />
                        <div className="px-8 pb-8">
                            <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg">
                                        <Building2 size={36} />
                                    </div>
                                    <div className="pt-12">
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-bold text-slate-900">
                                                {principal.name}
                                            </h1>
                                            <BadgeCheck
                                                size={20}
                                                className="text-blue-500"
                                            />
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Data Principal &amp; dokumen
                                            pendukung
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                {infoItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-slate-400 uppercase">
                                            <item.icon size={14} />
                                            {item.label}
                                        </div>
                                        <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {principal.notes && (
                                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                                    <p className="text-sm leading-relaxed text-slate-600">
                                        {principal.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-8 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Dokumen Principal
                                </h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Kelola dokumen pendukung principal
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingDocument(null);
                                    setDocumentModalOpen(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Tambah Dokumen
                            </button>
                        </div>

                        <div className="p-8">
                            {principal.documents.length ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {principal.documents.map((document) => (
                                        <div
                                            key={document.id}
                                            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:shadow-md"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <FileText size={22} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium text-slate-800">
                                                    {document.name.label}
                                                </p>
                                                <a
                                                    href={document.path}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                                                >
                                                    <Download size={12} />
                                                    Lihat file
                                                </a>
                                            </div>
                                            <div className="flex gap-1 lg:opacity-0 lg:transition lg:group-hover:opacity-100">
                                                <button
                                                    title="Edit"
                                                    onClick={() => {
                                                        setEditingDocument(
                                                            document,
                                                        );
                                                        setDocumentModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 lg:p-2"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    title="Hapus"
                                                    onClick={() =>
                                                        remove(
                                                            documents.destroy.url(
                                                                {
                                                                    principal:
                                                                        principal.id,
                                                                    document:
                                                                        document.id,
                                                                },
                                                            ),
                                                            'dokumen',
                                                        )
                                                    }
                                                    className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500 lg:p-2"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
                                    <FileText
                                        size={36}
                                        className="mb-3 text-slate-300"
                                    />
                                    <p className="text-sm font-medium text-slate-500">
                                        Belum ada dokumen
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Tambahkan dokumen pendukung principal di
                                        atas.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 px-8 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Reseller
                                </h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Daftar reseller terdaftar pada principal ini
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingReseller(null);
                                    setResellerModalOpen(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Tambah Reseller
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="mb-4 flex items-center gap-3 rounded-xl border bg-slate-50/60 px-4 py-2.5 lg:w-1/2">
                                <Search
                                    size={16}
                                    className="shrink-0 text-slate-400"
                                />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama reseller..."
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />
                            </div>
                            {principal.resellers.data.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="rounded-lg bg-slate-50 text-xs tracking-wide text-slate-400 uppercase">
                                                <th className="p-4">Nama</th>
                                                <th className="p-4 text-right">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {principal.resellers.data.map(
                                                (reseller, index) => (
                                                    <tr
                                                        key={reseller.id}
                                                        className="group border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                                                                    {index + 1}
                                                                </div>
                                                                <p className="font-medium text-slate-800">
                                                                    {
                                                                        reseller.name
                                                                    }
                                                                </p>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex justify-end gap-1 transition lg:opacity-0 lg:group-hover:opacity-100">
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            title="Detail"
                                                                            onClick={() =>
                                                                                setViewingReseller(
                                                                                    reseller,
                                                                                )
                                                                            }
                                                                            className="cursor-pointer rounded-lg p-1 text-blue-500 transition hover:bg-blue-50 lg:p-2"
                                                                        >
                                                                            <Eye
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span className="sr-only">
                                                                                Detail
                                                                            </span>
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Detail
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            title="Ubah"
                                                                            onClick={() => {
                                                                                setEditingReseller(
                                                                                    reseller,
                                                                                );
                                                                                setResellerModalOpen(
                                                                                    true,
                                                                                );
                                                                            }}
                                                                            className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 lg:p-2"
                                                                        >
                                                                            <Pencil
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span className="sr-only">
                                                                                Ubah
                                                                            </span>
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Ubah
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                                <Tooltip>
                                                                    <TooltipTrigger
                                                                        asChild
                                                                    >
                                                                        <button
                                                                            title="Hapus"
                                                                            onClick={() =>
                                                                                remove(
                                                                                    resellers.destroy.url(
                                                                                        {
                                                                                            principal:
                                                                                                principal.id,
                                                                                            reseller:
                                                                                                reseller.id,
                                                                                        },
                                                                                    ),
                                                                                    'reseller',
                                                                                )
                                                                            }
                                                                            className="cursor-pointer rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500 lg:p-2"
                                                                        >
                                                                            <Trash2
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span className="sr-only">
                                                                                Hapus
                                                                            </span>
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>
                                                                            Hapus
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
                                    <UserRound
                                        size={36}
                                        className="mb-3 text-slate-300"
                                    />
                                    <p className="text-sm font-medium text-slate-500">
                                        Belum ada reseller
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        Tambahkan reseller untuk principal ini.
                                    </p>
                                </div>
                            )}
                            {principal.resellers.data.length > 0 &&
                                principal.resellers.last_page > 1 && (
                                    <div className="mt-6">
                                        <Pagination
                                            current_page={
                                                principal.resellers.current_page
                                            }
                                            next_page_url={
                                                principal.resellers
                                                    .next_page_url
                                            }
                                            prev_page_url={
                                                principal.resellers
                                                    .prev_page_url
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    </section>
                </div>
            </AppLayout>

            <DocumentFormModal
                open={documentModalOpen}
                principalId={principal.id}
                documentTypes={document_types}
                editingDocument={editingDocument}
                onClose={() => setDocumentModalOpen(false)}
            />
            <ResellerDetailModal
                open={viewingReseller !== null}
                reseller={viewingReseller}
                onClose={() => setViewingReseller(null)}
            />
            <ResellerFormModal
                open={resellerModalOpen}
                principalId={principal.id}
                editingReseller={editingReseller}
                onClose={() => setResellerModalOpen(false)}
            />
        </>
    );
}
