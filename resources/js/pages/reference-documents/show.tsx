import { Head, Link } from '@inertiajs/react';

import {
    FileCheck2,
    CalendarDays,
    ArrowLeft,
    Building2,
    Hash,
    Tag,
    Link2,
    Copy,
    Check,
    ShieldCheck,
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

export default function ShowPage({ document }: Props) {
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

    const status = statusConfig[document.status];

    return (
        <>
            <Head title={`${document.reference_id} - Reference Document`} />

            <LandingLayout>
                <article className="pt-32 pb-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <Link
                            href="/reference-documents"
                            className="mb-8 inline-flex items-center gap-2 text-sm text-blue-600"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Reference Document
                        </Link>

                        <div className="mb-12 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600">
                                <FileCheck2 size={16} />
                                Reference Document
                            </div>

                            <h1 className="mt-6 text-4xl font-bold md:text-5xl">
                                {document.principal_name}
                            </h1>

                            <p className="mt-2 text-lg text-slate-500">
                                {document.company_name}
                            </p>

                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                                <CalendarDays size={16} />
                                Terdaftar pada {document.created_at}
                            </div>
                        </div>

                        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b bg-slate-50 px-8 py-4">
                                <div className="flex items-center gap-3">
                                    <Building2
                                        size={20}
                                        className="text-blue-600"
                                    />
                                    <h2 className="text-lg font-semibold">
                                        Informasi Dokumen
                                    </h2>
                                </div>
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status?.color}`}
                                >
                                    {status?.label}
                                </span>
                            </div>

                            <div className="grid divide-y md:grid-cols-2 md:divide-y-0">
                                <div className="border-b p-8 md:border-r md:border-b-0">
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
                                </div>
                                <div className="p-8">
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
                            </div>

                            {document.file_name && document.file_path && (
                                <div className="border-t px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <FileCheck2 size={16} className="text-blue-600" />
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
                                </div>
                            )}
                        </div>

                        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border bg-slate-50 p-6">
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
