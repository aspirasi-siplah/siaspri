import {
    Eye,
    Check,
    Copy,
    FileCheck2,
    CalendarDays,
    Hash,
    Building2,
    Tag,
    ShieldCheck,
    Link2,
    Download,
} from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useClipboard } from '@/hooks/use-clipboard';
import { statusConfig } from '@/lib/reference-documents';
import type { ReferenceDocument } from '@/lib/reference-documents';
import CustomModal from '../custom-components/CustomModal';

interface Props {
    document: ReferenceDocument;
}

export default function ShowModal({ document }: Props) {
    const [open, setOpen] = useState(false);
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
            <button
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"
                title="Lihat detail"
            >
                <Eye size={16} />
            </button>

            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title="Detail Reference Document"
                size="lg"
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-4 rounded-xl border bg-slate-50 px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <FileCheck2
                                size={20}
                                className="shrink-0 text-blue-600"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium">
                                    {document.reference_id}
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    {document.reference_link}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}
                        >
                            {status.label}
                        </span>
                    </div>

                    <div className="grid gap-x-6 md:grid-cols-2">
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
                            icon={<ShieldCheck size={16} />}
                            label="Kategori"
                            value={document.category_name || '-'}
                        />
                        <DetailRow
                            icon={<FileCheck2 size={16} />}
                            label="Program"
                            value={document.program_name || '-'}
                        />
                        <DetailRow
                            icon={<CalendarDays size={16} />}
                            label="Kedaluwarsa"
                            value={document.expired_date || '-'}
                        />
                    </div>

                    {document.file_name && document.file_path && (
                        <div className="flex items-center gap-3 rounded-xl border bg-slate-50 px-5 py-4">
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

                    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <Link2
                                size={16}
                                className="shrink-0 text-blue-600"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium">
                                    Reference Link
                                </p>
                                <p className="truncate text-xs text-slate-500">
                                    {document.reference_link}
                                </p>
                            </div>
                        </div>
                        {copied === document.reference_link ? (
                            <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white">
                                <Check size={14} />
                                Tersalin
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    copyLink(document.reference_link)
                                }
                                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                            >
                                <Copy size={14} />
                                Salin Link
                            </button>
                        )}
                    </div>
                </div>
            </CustomModal>
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
        <div className="flex items-start gap-4 py-3">
            <div className="mt-0.5 text-blue-600">{icon}</div>
            <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-800">
                    {value}
                </p>
            </div>
        </div>
    );
};
