import { useState } from 'react';
import { useForm } from '@inertiajs/react';

import QuillEditor from './quill-editor';
import FormInput from '../custom-components/FormInput';
import FormTextArea from '../custom-components/FormTextArea';
import ImageUploader from '../custom-components/ImageUploader';
import FormSelect from '../custom-components/FormSelect';
import NewsGalleryUpload from './news-gallery-upload';
import Swal from 'sweetalert2';
import TiptapEditor from './tiptap-editor';

interface ExistingNewsDocument {
    id: number;
    name: string;
    file_name: string;
    file_path: string;
    url: string;
}

interface NewsData {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    thumbnail?: string | null;
    documents?: ExistingNewsDocument[];
}

interface NewDocument {
    name: string;
    file: File;
    preview: string;
}

interface Props {
    news?: NewsData;
    submitUrl: string;
    method?: 'post' | 'put';
}

export default function NewsForm({ news, submitUrl, method }: Props) {
    const form = useForm({
        title: news?.title ?? '',
        excerpt: news?.excerpt ?? '',
        content: news?.content ?? '',
        status: news?.status ?? 'draft',
        thumbnail: null as File | null,
        documents: [] as File[],
        deleted_documents: [] as number[],
    });
    const [documents, setDocuments] = useState<NewDocument[]>([]);
    const [deletedDocumentIds, setDeletedDocumentIds] = useState<number[]>([]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        form.transform((data) => ({
            ...data,
            documents: documents.map((item) => ({
                name: item.name,
                file: item.file,
            })),
            deleted_documents: deletedDocumentIds,
        }));

        const options = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset('documents')
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Berita berhasil disimpan.',
                })
            },
            onError: () => {
                form.reset('documents')
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Berita gagal disimpan.',
                })
            },
        };

        if (method === 'put') {
            form.put(submitUrl, options);
            return;
        }

        form.post(submitUrl, options);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex gap-4">
                <div className="basis-1/3">
                    <ImageUploader
                        name="thumbnail"
                        title="Thumbnail"
                        defaultImage={news?.thumbnail}
                        onImageChange={(image) =>
                            form.setData('thumbnail', image)
                        }
                    />
                </div>
                <div className="w-full space-y-4">
                    <FormInput
                        name="title"
                        label="Judul"
                        type="text"
                        placeholder="Judul Berita"
                        value={form.data.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            form.setData('title', e.target.value)
                        }
                        error={form.errors.title}
                    />
                    <FormSelect
                        name="status"
                        label="Status"
                        value={form.data.status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            form.setData(
                                'status',
                                e.target.value as
                                    | 'draft'
                                    | 'published'
                                    | 'archived',
                            )
                        }
                        error={form.errors.status}
                        options={[
                            {
                                label: 'Draft',
                                value: 'draft',
                            },
                            {
                                label: 'Terbit',
                                value: 'published',
                            },
                            {
                                label: 'Arsip',
                                value: 'archived',
                            },
                        ]}
                    />
                    <FormTextArea
                        name="excerpt"
                        label="Kutipan"
                        placeholder="Kutipan Berita"
                        rows={4}
                        value={form.data.excerpt}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            form.setData('excerpt', e.target.value)
                        }
                        error={form.errors.excerpt}
                    />
                </div>
            </div>
            <div className="">
                <NewsGalleryUpload
                    existingDocuments={news?.documents ?? []}
                    documents={documents}
                    deletedDocumentIds={deletedDocumentIds}
                    onDocumentsChange={setDocuments}
                    onDeletedDocumentsChange={setDeletedDocumentIds}
                />
            </div>
            <div className="">
                <label className="mb-2 block">Konten Berita</label>
                <TiptapEditor
                    value={form.data.content}
                    onChange={(value) => form.setData('content', value)}
                />
                {/* <QuillEditor
                    value={form.data.content}
                    onChange={(value) => form.setData('content', value)}
                /> */}

                {form.errors.content && (
                    <p className="mt-2 text-sm text-red-500">
                        {form.errors.content}
                    </p>
                )}
            </div>
            <button
                type="submit"
                disabled={form.processing}
                className="rounded-xl bg-primary px-6 py-3 text-white disabled:opacity-50"
            >
                {form.processing
                    ? 'Menyimpan...'
                    : method === 'put'
                      ? 'Update Berita'
                      : 'Simpan Berita'}
            </button>
        </form>
    );
}
