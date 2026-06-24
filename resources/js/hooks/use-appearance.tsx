import { useSyncExternalStore } from 'react';

export type Appearance = 'light' | 'dark';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: Appearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();

let currentAppearance: Appearance = 'light';

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;

    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const stored = localStorage.getItem('appearance');

    return stored === 'dark' ? 'dark' : 'light';
};

const applyTheme = (appearance: Appearance): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const isDark = appearance === 'dark';

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => {
    listeners.forEach((listener) => listener());
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentAppearance = getStoredAppearance();

    applyTheme(currentAppearance);
}

export function useAppearance(): UseAppearanceReturn {
    const appearance = useSyncExternalStore<Appearance>(
        subscribe,
        () => currentAppearance,
        () => 'light',
    );

    const updateAppearance = (mode: Appearance): void => {
        currentAppearance = mode;

        localStorage.setItem('appearance', mode);
        setCookie('appearance', mode);

        applyTheme(mode);

        notify();
    };

    return {
        appearance,
        resolvedAppearance: appearance,
        updateAppearance,
    };
}
