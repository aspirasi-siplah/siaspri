import { Head, Link } from '@inertiajs/react';

import {
    ShieldCheck,
    ShieldX,
    FileCheck2,
    CalendarDays,
    Hash,
    Building2,
    Tag,
    ArrowLeft,
    Link2,
    Copy,
    Check,
    Download,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useClipboard } from '@/hooks/use-clipboard';
import LandingLayout from '@/layouts/landing-layout';
import { statusConfig } from '@/lib/reference-documents';
import type { ReferenceDocument } from '@/lib/reference-documents';

interface Props {
    document: ReferenceDocument;
}

export default function VerifyPage({ document }: Props) {
    const [copied, copy] = useClipboard();

    const copyLink = async (link: string) => {
        const success = await copy(link);

        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Tersalin!',
                text: 'Reference link berhasil disalin.',
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    const isValid = document.status === 'active';
    const status = statusConfig[document.status];

    return (
        <>
            <Head title={`Verifikasi ${document.reference_id}`} />

            <LandingLayout>
                <article className="pt-32 pb-24">
                    <div className="mx-auto max-w-4xl px-6">
                        <div className="mb-10 text-center">
                            <div
                                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${
                                    isValid ? 'bg-green-100' : 'bg-red-100'
                                }`}
                            >
                                {isValid ? (
                                    <ShieldCheck
                                        size={48}
                                        className="text-green-600"
                                    />
                                ) : (
                                    <ShieldX
                                        size={48}
                                        className="text-red-600"
                                    />
                                )}
                            </div>
                            <h1 className="mt-6 text-4xl font-bold">
                                {isValid
                                    ? 'Dokumen Terverifikasi'
                                    : 'Dokumen Tidak Valid'}
                            </h1>
                            <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
                                {isValid
                                    ? 'Reference Document berikut merupakan dokumen resmi milik Principal yang telah terdaftar dan terverifikasi dalam sistem kami.'
                                    : `Reference Document ini berstatus "${status?.label}". Dokumen tidak dapat digunakan untuk proses verifikasi.`}
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b bg-slate-50 px-8 py-4">
                                <div className="flex items-center gap-3">
                                    <FileCheck2
                                        size={20}
                                        className="text-blue-600"
                                    />
                                    <h2 className="text-lg font-semibold">
                                        Detail Reference Document
                                    </h2>
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status?.color}`}
                                >
                                    {status?.label}
                                </span>
                            </div>

                            <div className="p-8">
                                <div className="grid gap-x-8 md:grid-cols-2">
                                    <DetailRow
                                        icon={<Hash size={16} />}
                                        label="Reference ID"
                                        value={document.reference_id}
                                    />
                                    <DetailRow
                                        icon={<Building2 size={16} />}
                                        label="Principal"
                                        value={document.principal_name}
                                    />
                                    <DetailRow
                                        icon={<Building2 size={16} />}
                                        label="Perusahaan Toko"
                                        value={document.company_name || '-'}
                                    />
                                    <DetailRow
                                        icon={<Tag size={16} />}
                                        label="Nomor Dokumen"
                                        value={document.document_number}
                                    />
                                    <DetailRow
                                        icon={<FileCheck2 size={16} />}
                                        label="Program"
                                        value={document.program_name || '-'}
                                    />
                                    <DetailRow
                                        icon={<ShieldCheck size={16} />}
                                        label="Kategori"
                                        value={document.category_name || '-'}
                                    />
                                    <DetailRow
                                        icon={<CalendarDays size={16} />}
                                        label="Tanggal Kedaluwarsa"
                                        value={document.expired_date || '-'}
                                    />
                                </div>

                                {document.file_name && document.file_path && (
                                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-100 bg-slate-50 px-5 py-4">
                                        <FileCheck2 size={16} className="shrink-0 text-blue-600" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">File Dokumen</p>
                                            <p className="truncate text-xs text-slate-500">
                                                {document.file_name}
                                            </p>
                                        </div>
                                        <a
                                            href={document.file_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                                        >
                                            <Download size={12} />
                                            Unduh
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border bg-slate-50 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <Link2
                                        size={20}
                                        className="shrink-0 text-blue-600"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">
                                            Reference Link
                                        </p>
                                        <p className="truncate text-sm text-slate-500">
                                            {document.reference_link}
                                        </p>
                                    </div>
                                </div>
                                {copied === document.reference_link ? (
                                    <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
                                        <Check size={16} />
                                        Tersalin
                                    </button>
                                ) : (
                                    <button
                                        onClick={() =>
                                            copyLink(document.reference_link)
                                        }
                                        className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        <Copy size={16} />
                                        Salin Link
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <Link
                                href="/reference-documents"
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                <ArrowLeft size={16} />
                                Lihat Semua Reference Document
                            </Link>
                        </div>
                    </div>
                </article>
            </LandingLayout>
        </>
    );
}

const DetailRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => {
    return (
        <div className="flex items-start gap-4 py-4">
            <div className="mt-0.5 text-blue-600">{icon}</div>
            <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-0.5 font-medium text-gray-800">{value}</p>
            </div>
        </div>
    );
};
