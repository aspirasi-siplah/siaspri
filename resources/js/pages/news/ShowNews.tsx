import LandingLayout from '@/layouts/landing-layout';
import Navbar from '@/components/landing/navbar';

import { Head } from '@inertiajs/react';
import Footer from '@/components/landing/footer';

export default function ShowNews({ news }: any) {
    return (
        <>
            <Head title={news.title} />
            <LandingLayout>
                <article className="pt-32 pb-20">
                    <div className="mx-auto max-w-4xl px-6">
                        <img
                            src={news.thumbnail}
                            alt={news.title}
                            className="mb-10 h-[450px] w-full rounded-3xl object-cover"
                        />

                        <h1 className="text-4xl font-bold">{news.title}</h1>

                        <p className="mt-3 text-slate-500">
                            {news.published_at}
                        </p>

                        <div
                            className="prose prose-slate mt-10 max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: news.content,
                            }}
                        />
                    </div>
                </article>
            </LandingLayout>
        </>
    );
}