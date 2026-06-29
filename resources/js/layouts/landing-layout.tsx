import GoogleAnalytics from '@/components/analytics/google-analytics';
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
            <GoogleAnalytics />
            <Navbar />
            <div className="min-h-[calc(100vh-20px)]">{children}</div>
            <Footer />
        </div>
    );
}
