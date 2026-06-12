import { useState } from "react";
import CustomModal from "../custom-components/CustomModal";
import ImageUploader from "../custom-components/ImageUploader";
import { useForm } from "@inertiajs/react";
import FormInput from "../custom-components/FormInput";
import FormTextArea from "../custom-components/FormTextArea";
import Swal from "sweetalert2";
import { Pencil } from "lucide-react";

interface Merchant {
    id: number;
    merchant_name: string;
    image?: string | null;
    reason: string;
}

interface Props {
    merchant?: Merchant;
}

export default function ModalForm({ merchant }: Props) {
    const [open, setOpen] = useState(false);
    const isEdit = !!merchant;

    const form = useForm({
        merchant_name: merchant?.merchant_name ?? '',
        image: null as File | null,
        reason: merchant?.reason ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false)
                form.reset();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: isEdit ? 'Merchant berhasil diubah.' : 'Merchant berhasil disimpan.',
                })
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: isEdit ? 'Merchant gagal diubah.' : 'Merchant gagal disimpan.',
                })
            },
        };

        if (isEdit) {
            form.put(`blacklist-merchants/${merchant?.id}`, options);
            return;
        }

        form.post(`blacklist-merchants`, options);
    };

    return (
        <>
            {isEdit ? (
                <button
                    onClick={() => setOpen(true)}
                    className="rounded-lg border p-2"
                >
                    <Pencil size={16} />
                </button>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                    Tambah Merchant
                </button>
            )}

            <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title="Tambah Merchant"
                size="lg"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div>
                            <ImageUploader
                                name="image"
                                title="Foto Merchant"
                                defaultImage={merchant?.image}
                                onImageChange={(image) =>
                                    form.setData('image', image)
                                }
                            />
                        </div>

                        <div className="space-y-4 lg:col-span-2">
                            <FormInput
                                name="merchant_name"
                                label="Nama Merchant"
                                type="text"
                                value={form.data.merchant_name}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) =>
                                    form.setData(
                                        'merchant_name',
                                        e.target.value,
                                    )
                                }
                                error={form.errors.merchant_name}
                            />
                            <FormTextArea
                                name="reason"
                                label="Alasan Blacklist"
                                rows={8}
                                value={form.data.reason}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => form.setData('reason', e.target.value)}
                                error={form.errors.reason}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white disabled:opacity-50"
                        >
                            {form.processing
                                ? 'Menyimpan...'
                                : isEdit
                                  ? 'Perbarui'
                                  : 'Simpan'}
                        </button>
                    </div>
                </form>
                ;
            </CustomModal>
        </>
    );
}
