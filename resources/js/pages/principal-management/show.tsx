import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    Download,
    FileText,
    FileUp,
    Hash,
    Pencil,
    Plus,
    Trash2,
    Upload,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
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
};
type PrincipalDocument = {
    id: number;
    name: string;
    label: string;
    path: string;
};
type Principal = {
    id: number;
    name: string;
    notes: string | null;
    npwp_number: string | null;
    nib: string | null;
    resellers: Reseller[];
    documents: PrincipalDocument[];
};

export default function Show({ principal }: { principal: Principal }) {
    const [editingReseller, setEditingReseller] = useState<Reseller | null>(
        null,
    );
    const [editingDocument, setEditingDocument] =
        useState<PrincipalDocument | null>(null);
    const [resellerOpen, setResellerOpen] = useState(false);
    const [documentOpen, setDocumentOpen] = useState(false);
    const resellerForm = useForm({
        name: '',
        npwp_number: '',
        document_number: '',
        reference_code: '',
        file: null as File | null,
    });
    const documentForm = useForm({
        name: 'STATEMENT_LETTER',
        file: null as File | null,
    });
    const saveReseller = (event: React.FormEvent) => {
        event.preventDefault();
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingReseller(null);
                setResellerOpen(false);
                resellerForm.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Data reseller berhasil disimpan.',
                });
            },
        };

        if (editingReseller) {
            resellerForm.post(
                `${resellers.update.url({ principal: principal.id, reseller: editingReseller.id })}?_method=PUT`,
                options,
            );
        } else {
            resellerForm.post(resellers.store.url(principal.id), options);
        }
    };
    const saveDocument = (event: React.FormEvent) => {
        event.preventDefault();
        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingDocument(null);
                setDocumentOpen(false);
                documentForm.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Dokumen berhasil disimpan.',
                });
            },
        };

        if (editingDocument) {
            documentForm.post(
                `${documents.update.url({ principal: principal.id, document: editingDocument.id })}?_method=PUT`,
                options,
            );
        } else {
            documentForm.post(documents.store.url(principal.id), options);
        }
    };
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
            value: `${principal.resellers.length} reseller`,
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
                    <Link
                        href={principalManagement.index()}
                        className="inline-flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Principal
                    </Link>

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

                            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                                {infoItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
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
                        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
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
                                    setDocumentOpen(true);
                                    documentForm.reset();
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Tambah Dokumen
                            </button>
                        </div>

                        <div className="p-8">
                            {documentOpen ? (
                                <form
                                    onSubmit={saveDocument}
                                    className="mb-6 grid gap-3 rounded-xl border border-blue-100 bg-slate-50/60 p-5 md:grid-cols-3"
                                >
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-600">
                                            Jenis Dokumen
                                        </label>
                                        <select
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none"
                                            value={documentForm.data.name}
                                            onChange={(e) =>
                                                documentForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="STATEMENT_LETTER">
                                                Statement Letter
                                            </option>
                                            <option value="LETTER_OF_SUPPORT">
                                                Letter of Support
                                            </option>
                                            <option value="INTEGRITY_PACT">
                                                Integrity Pact
                                            </option>
                                        </select>
                                        {documentForm.errors.name && (
                                            <span className="text-xs text-red-500">
                                                {documentForm.errors.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-600">
                                            File Dokumen
                                        </label>
                                        <input
                                            type="file"
                                            required={!editingDocument}
                                            onChange={(e) =>
                                                documentForm.setData(
                                                    'file',
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:text-blue-600 focus:border-blue-500 focus:outline-none"
                                        />
                                        {documentForm.errors.file && (
                                            <span className="text-xs text-red-500">
                                                {documentForm.errors.file}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm text-white transition hover:bg-blue-700">
                                            <FileUp size={16} />
                                            Simpan
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingDocument(null);
                                                setDocumentOpen(false);
                                                documentForm.reset();
                                            }}
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            ) : null}

                            {principal.documents.length ? (
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                                                    {document.label}
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
                                            <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
                                                <button
                                                    title="Edit"
                                                    onClick={() => {
                                                        setEditingDocument(
                                                            document,
                                                        );
                                                        setDocumentOpen(true);
                                                        documentForm.setData({
                                                            name: document.name,
                                                            file: null,
                                                        });
                                                    }}
                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
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
                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
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
                                        Tambahkan dokumen pendukung principal
                                        di atas.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
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
                                    setResellerOpen(true);
                                    resellerForm.reset();
                                }}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Tambah Reseller
                            </button>
                        </div>

                        <div className="p-8">
                            {resellerOpen ? (
                                <form
                                    onSubmit={saveReseller}
                                    className="mb-6 grid gap-4 rounded-xl border border-blue-100 bg-slate-50/60 p-6 lg:grid-cols-2"
                                >
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-600">
                                            Nama Reseller *
                                        </label>
                                        <input
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Masukkan nama reseller"
                                            value={resellerForm.data.name}
                                            onChange={(e) =>
                                                resellerForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {resellerForm.errors.name && (
                                            <span className="text-xs text-red-500">
                                                {resellerForm.errors.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-600">
                                            NPWP
                                        </label>
                                        <input
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Masukkan nomor NPWP"
                                            value={
                                                resellerForm.data.npwp_number
                                            }
                                            onChange={(e) =>
                                                resellerForm.setData(
                                                    'npwp_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {resellerForm.errors.npwp_number && (
                                            <span className="text-xs text-red-500">
                                                {
                                                    resellerForm.errors
                                                        .npwp_number
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-600">
                                            Nomor Dokumen
                                        </label>
                                        <input
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Masukkan nomor dokumen"
                                            value={
                                                resellerForm.data
                                                    .document_number
                                            }
                                            onChange={(e) =>
                                                resellerForm.setData(
                                                    'document_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-slate-600">
                                            Reference Code
                                        </label>
                                        <input
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none"
                                            placeholder="Masukkan reference code"
                                            value={
                                                resellerForm.data.reference_code
                                            }
                                            onChange={(e) =>
                                                resellerForm.setData(
                                                    'reference_code',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 lg:col-span-2">
                                        <label className="text-sm font-medium text-slate-600">
                                            File Dokumen
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500 transition hover:border-blue-400 hover:bg-blue-50">
                                            <Upload size={16} />
                                            Klik untuk memilih file
                                            <input
                                                type="file"
                                                onChange={(e) =>
                                                    resellerForm.setData(
                                                        'file',
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    <div className="flex justify-end gap-2 lg:col-span-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingReseller(null);
                                                setResellerOpen(false);
                                                resellerForm.reset();
                                            }}
                                            className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Batal
                                        </button>
                                        <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-6 text-sm text-white transition hover:bg-blue-700">
                                            <FileUp size={16} />
                                            Simpan
                                        </button>
                                    </div>
                                </form>
                            ) : null}

                            {principal.resellers.length ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="rounded-lg bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                                                <th className="p-4">Nama</th>
                                                <th className="p-4">
                                                    Nomor Dokumen
                                                </th>
                                                <th className="p-4">
                                                    Reference Code
                                                </th>
                                                <th className="p-4 text-right">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {principal.resellers.map(
                                                (reseller, index) => (
                                                    <tr
                                                        key={reseller.id}
                                                        className="group border-b border-slate-100 transition hover:bg-slate-50/60 last:border-0"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-800">
                                                                        {
                                                                            reseller.name
                                                                        }
                                                                    </p>
                                                                    {reseller.npwp_number && (
                                                                        <p className="text-xs text-slate-400">
                                                                            {
                                                                                reseller.npwp_number
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-slate-600">
                                                            {reseller.document_number ||
                                                                '-'}
                                                        </td>
                                                        <td className="p-4 text-slate-600">
                                                            {reseller.reference_code ||
                                                                '-'}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                                                                <button
                                                                    title="Edit"
                                                                    onClick={() => {
                                                                        setEditingReseller(
                                                                            reseller,
                                                                        );
                                                                        setResellerOpen(
                                                                            true,
                                                                        );
                                                                        resellerForm.setData(
                                                                            {
                                                                                name: reseller.name,
                                                                                npwp_number:
                                                                                    reseller.npwp_number ||
                                                                                    '',
                                                                                document_number:
                                                                                    reseller.document_number ||
                                                                                    '',
                                                                                reference_code:
                                                                                    reseller.reference_code ||
                                                                                    '',
                                                                                file: null,
                                                                            },
                                                                        );
                                                                    }}
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                                                                >
                                                                    <Pencil
                                                                        size={16}
                                                                    />
                                                                </button>
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
                                                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                                                >
                                                                    <Trash2
                                                                        size={16}
                                                                    />
                                                                </button>
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
                        </div>
                    </section>
                </div>
            </AppLayout>
        </>
    );
}
