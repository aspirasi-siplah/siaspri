import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Check,
    Copy,
    FileCheck2,
    Link2,
    Store,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useClipboard } from '@/hooks/use-clipboard';
import LandingLayout from '@/layouts/landing-layout';
import principals from '@/routes/principals';

type Reseller = {
    id: number;
    name: string;
    npwp_number: string | null;
    document_number: string | null;
    reference_code: string | null;
    reference_link: string | null;
    principal_name: string | null;
    principal_link: string | null;
};

export default function Show({ reseller }: { reseller: Reseller }) {
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

    return (
        <>
            <Head title={reseller.name} />

            <LandingLayout>
                <article className="pt-28 pb-24">
                    <div className="mx-auto max-w-4xl px-6">
                        <div className="mb-10 text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                                <Store size={48} className="text-blue-600" />
                            </div>
                            <h1 className="mt-6 text-4xl font-bold">
                                {reseller.name}
                            </h1>
                        </div>

                        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b bg-slate-50 px-8 py-4">
                                <div className="flex items-center gap-3">
                                    <Building2 size={20} className="text-blue-600" />
                                    <h2 className="text-lg font-semibold">
                                        Detail Reseller
                                    </h2>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid gap-x-8 md:grid-cols-2">
                                    <DetailRow
                                        icon={<Building2 size={16} />}
                                        label="Principal"
                                        value={
                                            reseller.principal_name || '-'
                                        }
                                    />
                                    <DetailRow
                                        icon={<FileCheck2 size={16} />}
                                        label="Nomor Dokumen"
                                        value={reseller.document_number || '-'}
                                    />
                                    <div className="flex items-start gap-4 py-4">
                                        <div className="mt-0.5 text-blue-600">
                                            <Copy size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Reference Code
                                            </p>
                                            {reseller.reference_code ? (
                                                <span className="mt-0.5 inline-flex rounded-md bg-slate-100 px-2.5 py-1 font-mono text-sm font-semibold text-slate-700">
                                                    {reseller.reference_code}
                                                </span>
                                            ) : (
                                                <p className="mt-0.5 font-medium text-gray-800">
                                                    -
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {reseller.reference_link && reseller.principal_link && (
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
                                                {reseller.reference_link}
                                            </p>
                                        </div>
                                    </div>
                                    {copied === reseller.reference_link ? (
                                        <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white">
                                            <Check size={16} />
                                            Tersalin
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                copyLink(
                                                    reseller.reference_link!,
                                                )
                                            }
                                            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            <Copy size={16} />
                                            Salin Link
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-10 text-center">
                            <Link
                                href={
                                    reseller.principal_link ??
                                    principals.index()
                                }
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                <ArrowLeft size={16} />
                                {reseller.principal_link
                                    ? 'Lihat Profil Principal'
                                    : 'Lihat Semua Principal'}
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