import Hero from '@/components/landing/hero';
import LatestNews from '@/components/landing/LatestNews';
import PartnersSection from '@/components/landing/PartnersSection';
import ReferenceDocumentIntro from '@/components/landing/ReferenceDocumentIntro';
import Stats from '@/components/landing/stats';
import LandingLayout from '@/layouts/landing-layout';

export default function Welcome({ latestNews, stats }: any) {
    return (
        <LandingLayout>
            <Hero />
            <Stats stats={stats} />
            <PartnersSection />
            <ReferenceDocumentIntro />
            <LatestNews news={latestNews || []} />
        </LandingLayout>
    );
}
