import CustomModal from "@/components/custom-components/CustomModal";
import CustomTable from "@/components/custom-components/CustomTable";
import FormInput from "@/components/custom-components/FormInput";
import Pagination from "@/components/custom-components/Pagination";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

interface Category {
    data: {
        id: number;
        name: string;
        slug: string;
        description: string;
    }[];
    current_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    per_page: number;
    from: number;
    to: number;
}

interface Props {
    categories: Category;
}

export default function IndexCategory({ categories }: Props) {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const submit = (e: any) => {
        e.preventDefault();
        Swal.fire({
            title: "Tambah Kategori Baru",
            text: "Anda akan menambahkan kategori baru",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#a5a5a5",
            confirmButtonText: "Tambahkan",
            cancelButtonText: "Kembali",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                post(`categories`, {
                    onSuccess: () => {
                        setIsOpenModal(false);
                        reset();
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Kategori berhasil disimpan.',
                        });
                    },
                });
            }
        })
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Hapus Kategori",
            text: "Anda akan menghapus kategori ini",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#a5a5a5",
            confirmButtonText: "Hapus",
            cancelButtonText: "Kembali",
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                router.delete(`categories/${id}`, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil!',
                            text: 'Kategori berhasil dihapus.',
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal!',
                            text: 'Kategori gagal dihapus.',
                        });
                    },
                })
            }
        });
    };

    return (
        <>
            <Head title="Categories" />
            <AppLayout
                breadcrumbs={[
                    {
                        title: 'Kategori Berita',
                        href: '/categories',
                    },
                ]}
            >
                <div className="space-y-6 p-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Kategori Berita
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Manajemen kategori berita
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpenModal(true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm text-primary-foreground hover:bg-blue-600"
                        >
                            <Plus size={16} />
                            Tambah Kategori
                        </button>
                    </div>
                    <CustomTable
                        title="Kategori Berita"
                        icon={
                            <LayoutGrid
                                size={20}
                                strokeWidth={2.25}
                                className="text-muted-foreground"
                            />
                        }
                        header={['No', 'Kategori', 'Aksi']}
                        headerAlign={[
                            'text-center',
                            'text-center',
                            'text-center',
                        ]}
                    >
                        {categories.data.length > 0 ? (
                            categories.data.map((category: any, index: number) => (
                                <tr key={index} className="border-b">
                                    <td className="p-4 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="p-4 text-center">
                                        {category.name}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleDelete(category.id)} className="rounded-lg border border-red-200 p-2 text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-16 text-center text-sm text-gray-700"
                                >
                                    Tidak ada data
                                </td>
                            </tr>
                        )}
                    </CustomTable>
                    <Pagination
                        current_page={categories.current_page}
                        next_page_url={categories.next_page_url}
                        prev_page_url={categories.prev_page_url}
                        per_page={categories.per_page}
                        from={categories.from}
                        to={categories.to}
                    />
                </div>
            </AppLayout>
            <CustomModal
                size="sm"
                open={isOpenModal}
                title="Tambah Kategori"
                onClose={() => setIsOpenModal(false)}
            >
                <div className="space-y-4">
                    <form onSubmit={submit} className="space-y-4">
                        <FormInput
                            label="Nama Kategori"
                            type="text"
                            name="name"
                            placeholder="Masukkan Nama Kategori"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                        />
                        <FormInput
                            label="keterangan"
                            type="text"
                            name="description"
                            placeholder="Masukkan Keterangan"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('description', e.target.value)}
                            error={errors.description}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsOpenModal(false)}
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-500 px-4 py-2 text-sm text-primary-foreground hover:bg-gray-600"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm text-primary-foreground hover:bg-blue-600"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </CustomModal>
        </>
    );
}