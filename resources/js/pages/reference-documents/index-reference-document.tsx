import { Head, router } from '@inertiajs/react';
import { Trash2, FileCheck2, Link2, Copy, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import CustomTable from '@/components/custom-components/CustomTable';
import Pagination from '@/components/custom-components/Pagination';
import ModalForm from '@/components/reference-documents/ModalForm';
import ShowModal from '@/components/reference-documents/ShowModal';
import { useClipboard } from '@/hooks/use-clipboard';
import AppLayout from '@/layouts/app-layout';
import type { ReferenceDocument } from '@/lib/reference-documents';

interface Props {
    documents: {
        data: ReferenceDocument[];
        current_page: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        per_page: number;
        from: number;
        to: number;
    };
}

export default function Index({ documents }: Props) {
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

    const destroy = (documentId: number) => {
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(
                    `reference-documents-management/${documentId}/delete`,
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Berhasil!',
                                text: 'Reference Document berhasil dihapus.',
                            });
                        },
                        onError: () => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Gagal!',
                                text: 'Reference Document gagal dihapus.',
                            });
                        },
                    },
                );
            }
        });
    };

    return (
        <>
            <Head title="Reference Document" />
            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Reference Document',
                        href: '',
                    },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Principal Reference Document
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Kelola dokumen referensi milik Principal dan
                                reference link-nya.
                            </p>
                        </div>
                        <ModalForm />
                    </div>
                    <CustomTable
                        title="Daftar Reference Document"
                        icon={
                            <FileCheck2
                                size={20}
                                className="text-muted-foreground"
                            />
                        }
                        header={[
                            'Reference ID',
                            'Principal',
                            'Kedaluwarsa',
                            'Aksi',
                        ]}
                        headerAlign={[
                            'text-left',
                            'text-left',
                            'text-center',
                            'text-center',
                        ]}
                    >
                        {documents.data.length > 0 ? (
                            documents.data.map((document) => (
                                <tr key={document.id} className="border-t">
                                    <td className="max-w-64 px-4 py-1">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-medium">
                                                {document.reference_id}
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Link2 size={12} />
                                                <span className="max-w-40 truncate">
                                                    {document.reference_link}
                                                </span>
                                                {copied ===
                                                document.reference_link ? (
                                                    <Check
                                                        size={12}
                                                        className="shrink-0 text-green-600"
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() =>
                                                            copyLink(
                                                                document.reference_link,
                                                            )
                                                        }
                                                        className="shrink-0 cursor-pointer hover:text-blue-600"
                                                        title="Salin link"
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-1 text-sm font-medium text-gray-700">
                                        {document.principal_name}
                                    </td>
                                    <td className="px-4 py-1 text-center text-sm text-gray-600">
                                        {document.expired_date}
                                    </td>
                                    <td className="px-4 py-1">
                                        <div className="flex justify-center gap-2">
                                            <ShowModal document={document} />
                                            <ModalForm document={document} />
                                            <button
                                                onClick={() =>
                                                    destroy(document.id)
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
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </CustomTable>
                    <Pagination
                        current_page={documents.current_page}
                        next_page_url={documents.next_page_url}
                        prev_page_url={documents.prev_page_url}
                        per_page={documents.per_page}
                        from={documents.from}
                        to={documents.to}
                    />
                </div>
            </AppLayout>
        </>
    );
}
