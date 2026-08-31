import {
    Check,
    Copy,
    ExternalLink,
    Eye,
    FileText,
    Hash,
    Link2,
    UserRound,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useClipboard } from '@/hooks/use-clipboard';
import CustomModal from '../custom-components/CustomModal';

type Reseller = {
    id: number;
    name: string;
    npwp_number: string | null;
    document_number: string | null;
    document_path: string | null;
    reference_code: string | null;
    reference_link: string | null;
};

interface Props {
    open: boolean;
    reseller: Reseller | null;
    onClose: () => void;
}

export default function ResellerDetailModal({
    open,
    reseller,
    onClose,
}: Props) {
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

    if (!reseller) {
        return null;
    }

    return (
        <CustomModal
            open={open}
            onClose={onClose}
            title="Detail Reseller"
            size="md"
        >
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
                        {reseller.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-slate-800">
                            {reseller.name}
                        </p>
                        <p className="text-xs text-slate-400">
                            ID Reseller #{reseller.id}
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                    <DetailRow
                        icon={<Hash size={16} />}
                        label="NPWP"
                        value={reseller.npwp_number || '-'}
                    />
                    <DetailRow
                        icon={<FileText size={16} />}
                        label="Nomor Dokumen"
                        value={reseller.document_number || '-'}
                    />
                    <DetailRow
                        icon={<UserRound size={16} />}
                        label="Reference Code"
                        value={
                            reseller.reference_code ? (
                                <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm font-semibold text-slate-700">
                                    {reseller.reference_code}
                                </span>
                            ) : (
                                '-'
                            )
                        }
                    />
                </div>

                <div>
                    <p className="mb-2 text-sm font-medium text-slate-600">
                        Reference Link
                    </p>
                    {reseller.reference_link ? (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <Link2
                                    size={16}
                                    className="shrink-0 text-blue-600"
                                />
                                <span className="truncate text-sm text-slate-600">
                                    {reseller.reference_link}
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                {copied === reseller.reference_link ? (
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                                        <Check size={16} />
                                        Tersalin
                                    </span>
                                ) : (
                                    <button
                                        onClick={() =>
                                            copyLink(
                                                reseller.reference_link!,
                                            )
                                        }
                                        title="Salin link"
                                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                                    >
                                        <Copy size={16} />
                                    </button>
                                )}
                                <a
                                    href={reseller.reference_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Buka link"
                                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                                >
                                    <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                            -
                        </p>
                    )}
                </div>

                {reseller.document_path && (
                    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                        <FileText size={16} className="shrink-0 text-blue-600" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-700">
                                File Dokumen
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                Lampiran dokumen reseller
                            </p>
                        </div>
                        <a
                            href={reseller.document_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                            <Eye size={12} />
                            Lihat
                        </a>
                    </div>
                )}

                <div className="flex justify-end border-t border-gray-100 pt-5">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </CustomModal>
    );
}

const DetailRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) => {
    return (
        <div className="flex items-center justify-between gap-4 py-3 px-4">
            <div className="flex items-center gap-3 text-slate-500">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <div className="text-right text-sm font-medium text-gray-800">
                {value}
            </div>
        </div>
    );
};