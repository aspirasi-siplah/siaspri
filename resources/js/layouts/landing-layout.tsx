import Footer from '@/components/landing/footer';
import Navbar from '@/components/landing/navbar';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function LandingLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Head>
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`}
                />
                <script>
                    {`
                        window.dataLayer = window.dataLayer || [];

                        function gtag(){
                            dataLayer.push(arguments);
                        }

                        gtag('js', new Date());

                        gtag(
                            'config',
                            '${import.meta.env.VITE_GA_ID}'
                        );
                    `}
                </script>
            </Head>
            <Navbar />
            <div className="min-h-[calc(100vh-20px)]">{children}</div>
            <Footer />
        </div>
    );
}
