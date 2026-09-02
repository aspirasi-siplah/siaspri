import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    Ban,
    Building2,
    FileText,
    House,
    LayoutGrid,
    Newspaper,
    UserPlus,
} from 'lucide-react';
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
import activityLog from '@/routes/activity-log';
import blacklistMerchants from '@/routes/blacklist-merchants';
import categories from '@/routes/categories';
import newsManagement from '@/routes/news-management';
import principalManagement from '@/routes/principal-management';
import templateDocumentsManagement from '@/routes/template-documents-management';
import userManagement from '@/routes/user-management';
import type { NavItem } from '@/types';

type ActiveKey = 'currentUrl' | 'startsWith' | 'includes';

type ItemsProps = (NavItem & {
    activeKey?: ActiveKey;
    adminOnly?: boolean;
})[];

const mainNavItems: ItemsProps = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: House,
        activeKey: 'currentUrl',
    },
    {
        title: 'Tambah Pengguna',
        href: userManagement.index(),
        icon: UserPlus,
        activeKey: 'startsWith',
        adminOnly: true,
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
    {
        title: 'Template Dokumen',
        href: templateDocumentsManagement.index(),
        icon: FileText,
        activeKey: 'startsWith',
    },
    {
        title: 'Log Aktivitas',
        href: activityLog.index(),
        icon: Activity,
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
    const { props } = usePage<{ auth: { role?: string | null } }>();
    const isAdmin = props.auth?.role === 'admin';
    const visibleNavItems = mainNavItems.filter(
        (item) => !item.adminOnly || isAdmin,
    );

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
                <NavMain label="Fitur Utama" items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
