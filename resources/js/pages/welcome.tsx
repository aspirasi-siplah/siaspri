import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
import LandingLayout from '@/layouts/landing-layout';
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import Stats from '@/components/landing/stats';
import LatestNews from '@/components/landing/LatestNews';
import { useState } from 'react';

export default function Welcome() {
    const [latestNews, setLatestNews] = useState<any[]>([]);
    const { auth } = usePage<any>().props;

    return (
        <LandingLayout>
            <Hero />
            <Stats />
            <LatestNews news={latestNews || []} />
        </LandingLayout>
    );
}
