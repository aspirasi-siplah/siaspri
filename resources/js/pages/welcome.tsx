import { usePage } from '@inertiajs/react';
import LandingLayout from '@/layouts/landing-layout';
import Hero from '@/components/landing/hero';
import Stats from '@/components/landing/stats';
import LatestNews from '@/components/landing/LatestNews';
import { useState } from 'react';
import PartnersSection from '@/components/landing/PartnersSection';

interface Props {
    latestNews: any[];
    stats: any[];
}


export default function Welcome({ latestNews, stats }: any) {
    const { auth } = usePage<any>().props;

    return (
        <LandingLayout>
            <Hero />
            <Stats stats={stats} />
            <PartnersSection />
            <LatestNews news={latestNews || []} />
        </LandingLayout>
    );
}
