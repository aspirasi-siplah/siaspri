import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

import QuillEditor from './quill-editor';
import FormInput from '../custom-components/FormInput';
import FormTextArea from '../custom-components/FormTextArea';
import ImageUploader from '../custom-components/ImageUploader';
import FormSelect from '../custom-components/FormSelect';

interface Props {
    news?: any;
    submitUrl: string;
    method?: 'post' | 'put';
}

export default function NewsForm({ news, submitUrl, method = 'post' }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: news?.title ?? '',
        slug: news?.slug ?? '',
        excerpt: news?.excerpt ?? '',
        content: news?.content ?? '',
        status: news?.status ?? 'draft',
        thumbnail: null as File | null,
    });

    useEffect(() => {
        if (!data.title) return;

        const slug = data.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        setData('slug', slug);
    }, [data.title]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (method === 'put') {
            put(submitUrl);
            return;
        }

        post(submitUrl);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex gap-4">
                <div className="basis-1/3">
                    <ImageUploader
                        name="thumbnail"
                        title="Thumbnail"
                        defaultImage={news?.thumbnail}
                        onImageChange={(image: any) =>
                            setData('thumbnail', image)
                        }
                    />
                </div>
                <div className="w-full space-y-4">
                    <FormInput
                        name="title"
                        type="text"
                        label="Judul"
                        placeholder="Judul Berita"
                        value={data.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setData('title', e.target.value)
                        }
                        error={errors.title}
                    />
                    <FormSelect
                        name="status"
                        label="Status"
                        value={data.status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setData('status', e.target.value)
                        }
                        error={errors.status}
                        options={[
                            { label: 'Draft', value: 'draft' },
                            { label: 'Terbit', value: 'published' },
                            { label: 'Arsip', value: 'archived' },
                        ]}
                    />
                    <FormTextArea
                        name="excerpt"
                        label="Ringkasan"
                        placeholder="Ringkasan Berita"
                        rows={4}
                        value={data.excerpt}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            setData('excerpt', e.target.value)
                        }
                        error={errors.excerpt}
                    />
                </div>
            </div>
            <div className="">
                <label className="mb-2 block">Konten Berita</label>
                <QuillEditor
                    value={data.content}
                    onChange={(value) => setData('content', value)}
                />
            </div>
            <button
                disabled={processing}
                className="rounded-xl bg-primary px-6 py-3 text-white"
            >
                Simpan Berita
            </button>
        </form>
    );
}
