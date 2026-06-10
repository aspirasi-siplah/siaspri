import Footer from '@/components/landing/footer';
import Navbar from '@/components/landing/navbar';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default function LandingLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
