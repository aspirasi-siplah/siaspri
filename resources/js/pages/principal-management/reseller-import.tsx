import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Download,
    FileArchive,
    FileSpreadsheet,
    Loader2,
    Upload,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import AppLayout from '@/layouts/app-layout';
import principalManagement from '@/routes/principal-management';

type ImportFailure = {
    row: number;
    attribute: string;
    errors: string[];
};

type ImportResult = {
    imported: number;
    failures: ImportFailure[];
} | null;

interface Props {
    principal: {
        id: number;
        name: string;
    };
    result: ImportResult;
}

const columns = [
    { key: 'Nama Reseller', label: 'Nama Reseller', note: 'Wajib diisi' },
    { key: 'NPWP', label: 'NPWP', note: 'Opsional' },
    { key: 'Nomor Dokumen', label: 'Nomor Dokumen', note: 'Opsional' },
    {
        key: 'Nama File Dokumen',
        label: 'Nama File Dokumen',
        note: 'Opsional — nama file dalam ZIP',
    },
];

const attributeLabels: Record<string, string> = {
    nama_reseller: 'Nama Reseller',
    npwp: 'NPWP',
    nomor_dokumen: 'Nomor Dokumen',
    nama_file_dokumen: 'Nama File Dokumen',
    document_file: 'File Dokumen',
    document_zip: 'File ZIP',
};

function FileUploadArea({
    file,
    onFile,
    accept,
    icon,
    acceptedText,
    placeholderIcon,
}: {
    file: File | null;
    onFile: (file: File | undefined) => void;
    accept: string;
    icon: 'spreadsheet' | 'archive';
    acceptedText: string;
    placeholderIcon: React.ReactNode;
}) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <label
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                onFile(e.dataTransfer.files[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragging
                    ? 'border-blue-500 bg-blue-50/60'
                    : 'border-slate-300 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50'
            }`}
        >
            {file ? (
                <>
                    {icon === 'spreadsheet' ? (
                        <FileSpreadsheet
                            size={36}
                            className="mb-3 text-blue-600"
                        />
                    ) : (
                        <FileArchive size={36} className="mb-3 text-blue-600" />
                    )}
                    <p className="font-medium text-slate-800">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-400">
                        {(file.size / 1024).toFixed(0)} KB — klik untuk
                        mengganti file
                    </p>
                </>
            ) : (
                <>
                    {placeholderIcon}
                    <p className="font-medium text-slate-700">
                        Klik untuk memilih {acceptedText} atau seret file ke
                        sini
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{accept}</p>
                </>
            )}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={(e) => onFile(e.target.files?.[0])}
                className="hidden"
            />
        </label>
    );
}

export default function ResellerImport({ principal, result }: Props) {
    const form = useForm({
        file: null as File | null,
        document_zip: null as File | null,
    });

    const handleExcel = (file: File | undefined) => {
        if (!file) {
            return;
        }

        if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
            Swal.fire({
                icon: 'error',
                title: 'Format Tidak Sesuai',
                text: 'File harus berformat .xlsx, .xls, atau .csv.',
            });

            return;
        }

        form.setData('file', file);
    };

    const handleZip = (file: File | undefined) => {
        if (!file) {
            return;
        }

        if (!/\.zip$/i.test(file.name)) {
            Swal.fire({
                icon: 'error',
                title: 'Format Tidak Sesuai',
                text: 'File dokumen harus berformat .zip.',
            });

            return;
        }

        form.setData('document_zip', file);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.file) {
            Swal.fire({
                icon: 'warning',
                title: 'File Excel Belum Dipilih',
                text: 'Silakan pilih file Excel terlebih dahulu.',
            });

            return;
        }

        form.post(
            principalManagement.resellers.import.store.url(principal.id),
            {
                forceFormData: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Bulk Import Reseller" />
            <AppLayout
                breadcrumbs={[
                    { title: 'Principal', href: principalManagement.index() },
                    {
                        title: principal.name,
                        href: principalManagement.show(principal.id),
                    },
                    {
                        title: 'Bulk Import Reseller',
                        href: principalManagement.resellers.import(
                            principal.id,
                        ),
                    },
                ]}
            >
                <div className="space-y-8 p-12">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Bulk Import Reseller
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Import banyak data reseller untuk{' '}
                                <span className="font-semibold text-slate-700">
                                    {principal.name}
                                </span>{' '}
                                beserta dokumen pendukungnya.
                            </p>
                        </div>
                        <Link
                            href={principalManagement.show(principal.id)}
                            className="inline-flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50 sm:w-fit"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Link>
                    </div>

                    {result && (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-neutral-50/60 px-8 py-5">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Hasil Import
                                </h2>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50/60 p-5">
                                    <CheckCircle2
                                        size={28}
                                        className="shrink-0 text-green-600"
                                    />
                                    <div>
                                        <p className="font-semibold text-green-800">
                                            {result.imported} reseller berhasil
                                            diimpor
                                        </p>
                                        {result.failures.length > 0 && (
                                            <p className="mt-0.5 text-sm text-green-700">
                                                {result.failures.length} masalah
                                                perlu diperhatikan.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {result.failures.length > 0 && (
                                    <div className="mt-6 overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="rounded-lg bg-slate-50 text-xs tracking-wide text-slate-400 uppercase">
                                                    <th className="p-4">
                                                        Baris
                                                    </th>
                                                    <th className="p-4">
                                                        Kolom
                                                    </th>
                                                    <th className="p-4">
                                                        Alasan
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.failures.map(
                                                    (failure, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-b border-slate-100 last:border-0"
                                                        >
                                                            <td className="p-4 font-medium text-slate-800">
                                                                {failure.row ===
                                                                0
                                                                    ? '-'
                                                                    : failure.row}
                                                            </td>
                                                            <td className="p-4 text-slate-600">
                                                                {attributeLabels[
                                                                    failure
                                                                        .attribute
                                                                ] ??
                                                                    failure.attribute}
                                                            </td>
                                                            <td className="p-4 text-slate-600">
                                                                <ul className="list-disc pl-4">
                                                                    {failure.errors.map(
                                                                        (
                                                                            error,
                                                                            errorIndex,
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    errorIndex
                                                                                }
                                                                            >
                                                                                {
                                                                                    error
                                                                                }
                                                                            </li>
                                                                        ),
                                                                    )}
                                                                </ul>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-neutral-50/60 px-8 py-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Unggah File
                            </h2>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Unggah file Excel berisi data reseller, dan
                                opsional file ZIP berisi dokumen pendukung per
                                reseller.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6 p-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">
                                        File Excel
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>
                                    <FileUploadArea
                                        file={form.data.file}
                                        onFile={handleExcel}
                                        accept=".xlsx,.xls,.csv (maks. 10 MB)"
                                        icon="spreadsheet"
                                        acceptedText="file Excel"
                                        placeholderIcon={
                                            <Upload
                                                size={36}
                                                className="mb-3 text-slate-400"
                                            />
                                        }
                                    />
                                    {form.data.file && (
                                        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                                            <p className="text-sm font-medium text-slate-700">
                                                File Excel siap diimpor
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    form.setData('file', null)
                                                }
                                                className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                                title="Hapus file"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                    {form.errors.file && (
                                        <p className="text-sm text-red-500">
                                            {form.errors.file}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-600">
                                        File ZIP Dokumen{' '}
                                        <span className="font-normal text-slate-400">
                                            (opsional)
                                        </span>
                                    </label>
                                    <FileUploadArea
                                        file={form.data.document_zip}
                                        onFile={handleZip}
                                        accept=".zip (maks. 50 MB)"
                                        icon="archive"
                                        acceptedText="file ZIP"
                                        placeholderIcon={
                                            <FileArchive
                                                size={36}
                                                className="mb-3 text-slate-400"
                                            />
                                        }
                                    />
                                    {form.data.document_zip && (
                                        <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                                            <p className="text-sm font-medium text-slate-700">
                                                File ZIP siap diproses
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    form.setData(
                                                        'document_zip',
                                                        null,
                                                    )
                                                }
                                                className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                                title="Hapus file"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                    {form.errors.document_zip && (
                                        <p className="text-sm text-red-500">
                                            {form.errors.document_zip}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {form.processing ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Proses Import
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-neutral-50/60 px-8 py-5 sm:flex-row sm:items-center">
                            <div className="w-full sm:w-fit">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Format Template
                                </h2>
                                <p className="mt-0.5 text-sm text-slate-500">
                                    Baris kedua file berisi nama kolom sesuai
                                    tabel berikut, dan data diisi mulai baris
                                    ketiga.
                                </p>
                            </div>
                            <div className="w-full sm:w-fit">
                                <a
                                    href={principalManagement.resellers.import.template.url(
                                        principal.id,
                                    )}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                                >
                                    <Download size={16} />
                                    Unduh template Excel
                                </a>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="rounded-lg bg-slate-50 text-xs tracking-wide text-slate-400 uppercase">
                                            <th className="p-4">Kolom</th>
                                            <th className="p-4">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {columns.map((column) => (
                                            <tr
                                                key={column.key}
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <td className="p-4 font-medium text-blue-600">
                                                    {column.key}
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-slate-700">
                                                        {column.label}
                                                    </span>
                                                    <span className="ml-2 text-xs text-slate-400">
                                                        {column.note}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Panduan Mengunggah Dokumen
                                </h3>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                                    <li>
                                        Kolom <code>Nama File Dokumen</code>{' '}
                                        berisi nama file (beserta ekstensi)
                                        persis seperti nama file di dalam ZIP.
                                    </li>
                                    <li>
                                        File ZIP berisi dokumen asli yang akan
                                        diunggah, dengan nama yang sama dengan
                                        yang diisi pada kolom{' '}
                                        <code>Nama File Dokumen</code>.
                                    </li>
                                    <li>
                                        Jika tidak ingin mengunggah dokumen,
                                        biarkan kolom{' '}
                                        <code>Nama File Dokumen</code> kosong
                                        dan tidak perlu mengunggah file ZIP.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
