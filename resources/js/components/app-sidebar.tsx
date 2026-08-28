import { Link } from '@inertiajs/react';
import { Ban, Building2, House, LayoutGrid, Newspaper } from 'lucide-react';
import AppLogo from '@/components/app-logo';
// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import blacklistMerchants from '@/routes/blacklist-merchants';
import categories from '@/routes/categories';
import newsManagement from '@/routes/news-management';
import principalManagement from '@/routes/principal-management';
import type { NavItem } from '@/types';

type ActiveKey = 'currentUrl' | 'startsWith' | 'includes';

type ItemsProps = (NavItem & {
    activeKey?: ActiveKey;
})[];

const mainNavItems: ItemsProps = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: House,
        activeKey: 'currentUrl',
    },
    {
        title: 'Kategori Berita',
        href: categories.index(),
        icon: LayoutGrid,
        activeKey: 'startsWith',
    },
    {
        title: 'Manajemen Berita',
        href: newsManagement.index(),
        icon: Newspaper,
        activeKey: 'startsWith',
    },
    {
        title: 'Blacklist Merchant',
        href: blacklistMerchants.index(),
        icon: Ban,
        activeKey: 'startsWith',
    },
    {
        title: 'Principal',
        href: principalManagement.index(),
        icon: Building2,
        activeKey: 'startsWith',
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: FolderGit2,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={newsManagement.index()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain label="Fitur Utama" items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
