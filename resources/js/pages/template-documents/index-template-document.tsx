import { Head, router } from '@inertiajs/react';
import { FileText, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import CustomTable from '@/components/custom-components/CustomTable';
import ModalForm from '@/components/template-documents/ModalForm';
import AppLayout from '@/layouts/app-layout';

interface TemplateDocument {
    id: string;
    label: string;
    file_name: string;
    file_path: string;
    view_url: string | null;
    created_at: string;
    updated_at: string;
}

interface LabelOption {
    value: string;
    label: string;
}

interface Props {
    documents: TemplateDocument[];
    label_options: LabelOption[];
}

const labelMap: Record<string, string> = {
    SURAT_PERNYATAAN: 'Surat Pernyataan',
    SURAT_DUKUNGAN: 'Surat Dukungan',
    PAKTA_INTEGRITAS: 'Pakta Integritas',
};

export default function IndexTemplateDocument({
    documents,
    label_options,
}: Props) {
    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Hapus Template Dokumen',
            text: 'Anda akan menghapus template dokumen ini',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#a5a5a5',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Kembali',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.delete(`template-documents-management/${id}/delete`, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Template dokumen berhasil dihapus.',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: 'Template dokumen gagal dihapus.',
                        });
                    },
                });
            }
        });
    };

    return (
        <>
            <Head title="Template Dokumen" />
            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Template Dokumen',
                        href: '',
                    },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Template Dokumen
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola dokumen template yang dapat diunduh oleh
                                pengguna.
                            </p>
                        </div>
                        <ModalForm labelOptions={label_options} />
                    </div>
                    <CustomTable
                        title="Daftar Template Dokumen"
                        icon={
                            <FileText
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={['Label', 'Nama File', 'Terakhir Diperbarui', 'Aksi']}
                        headerAlign={[
                            'text-left',
                            'text-left',
                            'text-left',
                            'text-center',
                        ]}
                    >
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <tr key={doc.id} className="border-t">
                                    <td className="px-4 py-3 text-sm font-medium">
                                        {labelMap[doc.label] ?? doc.label}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {doc.file_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(doc.updated_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <ModalForm
                                                document={doc}
                                                labelOptions={label_options}
                                            />
                                            <button
                                                onClick={() =>
                                                    handleDelete(doc.id)
                                                }
                                                className="cursor-pointer rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="py-16 text-center text-sm text-gray-700"
                                >
                                    Belum ada template dokumen
                                </td>
                            </tr>
                        )}
                    </CustomTable>
                </div>
            </AppLayout>
        </>
    );
}
