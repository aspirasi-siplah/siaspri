import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, Download, FileText } from 'lucide-react';
import LandingLayout from '@/layouts/landing-layout';
import principals from '@/routes/principals';

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
    return (
        <>
            <Head title={principal.name} />
            <LandingLayout>
                <main className="pt-32 pb-24">
                    <div className="mx-auto max-w-6xl px-6">
                        <Link
                            href={principals.index()}
                            className="inline-flex items-center gap-2 text-sm text-blue-600"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Principal
                        </Link>
                        <header className="mt-10 border-b pb-10">
                            <Building2 className="text-blue-600" size={32} />
                            <h1 className="mt-5 text-4xl font-bold">
                                {principal.name}
                            </h1>
                            <p className="mt-3 text-slate-500">
                                NPWP: {principal.npwp_number || '-'} | NIB:{' '}
                                {principal.nib || '-'}
                            </p>
                            {principal.notes && (
                                <p className="mt-5 max-w-3xl text-slate-600">
                                    {principal.notes}
                                </p>
                            )}
                        </header>
                        <div className="grid gap-12 pt-10 lg:grid-cols-[1fr_1.35fr]">
                            <section>
                                <h2 className="text-2xl font-semibold">
                                    Dokumen Principal
                                </h2>
                                <div className="mt-5 space-y-3">
                                    {principal.documents.map((document) => (
                                        <a
                                            key={document.id}
                                            href={document.path}
                                            target="_blank"
                                            className="flex items-center gap-3 rounded-xl border bg-white p-4 transition hover:border-blue-300"
                                        >
                                            <FileText
                                                size={20}
                                                className="text-blue-600"
                                            />
                                            <span className="flex-1 font-medium">
                                                {document.label}
                                            </span>
                                            <Download
                                                size={16}
                                                className="text-slate-400"
                                            />
                                        </a>
                                    ))}
                                    {!principal.documents.length && (
                                        <p className="text-sm text-slate-500">
                                            Belum ada dokumen publik.
                                        </p>
                                    )}
                                </div>
                            </section>
                            <section>
                                <h2 className="text-2xl font-semibold">
                                    Reseller
                                </h2>
                                <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b bg-slate-50">
                                                <th className="p-4">Nama</th>
                                                <th className="p-4">
                                                    Nomor Dokumen
                                                </th>
                                                <th className="p-4">
                                                    Reference Code
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {principal.resellers.map(
                                                (reseller) => (
                                                    <tr
                                                        key={reseller.id}
                                                        className="border-b last:border-0"
                                                    >
                                                        <td className="p-4 font-medium">
                                                            {reseller.name}
                                                        </td>
                                                        <td className="p-4">
                                                            {reseller.document_number ||
                                                                '-'}
                                                        </td>
                                                        <td className="p-4">
                                                            {reseller.reference_code ||
                                                                '-'}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                    {!principal.resellers.length && (
                                        <p className="p-8 text-center text-sm text-slate-500">
                                            Belum ada reseller.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </LandingLayout>
        </>
    );
}
