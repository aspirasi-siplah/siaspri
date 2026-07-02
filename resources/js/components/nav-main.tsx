import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

type ActiveKey = 'currentUrl' | 'startsWith' | 'includes';

type ItemsProps = (NavItem & {
    activeKey?: ActiveKey;
})[];

export function NavMain({ label, items = [] }: { label?: string; items: ItemsProps }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { url } = usePage();

    const isActive = (item: ItemsProps[number]) => {
        const href: any = item.href;

        switch (item.activeKey) {
            case 'currentUrl':
                return isCurrentUrl(item.href);

            case 'startsWith':
                return url === href.url || url.startsWith(`${href.url}/`);

            case 'includes':
                return url.includes(href.url as string);

            default:
                return false;
        }
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label || 'Fitur Utama'}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive(item)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
