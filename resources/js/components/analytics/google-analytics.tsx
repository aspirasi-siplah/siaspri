import { useEffect } from 'react';

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

export default function GoogleAnalytics() {
    useEffect(() => {
        const measurementId = import.meta.env.VITE_GA_ID;

        if (!measurementId) return;

        if (document.getElementById('google-analytics')) return;

        const script = document.createElement('script');

        script.id = 'google-analytics';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];

        window.gtag = (...args) => {
            window.dataLayer.push(args);
        };

        window.gtag('js', new Date());
        window.gtag('config', measurementId);
    }, []);

    return null;
}
