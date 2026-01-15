import { NavFooter } from '@/components/nav-footer';
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
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Bed,
    BookOpen,
    Building2,
    CalendarCheck,
    Folder,
    LayoutGrid,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

const managerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Rooms',
        href: '/rooms',
        icon: Bed,
    },
    {
        title: 'Guests',
        href: '/guests',
        icon: Users,
    },
    {
        title: 'Bookings',
        href: '/bookings',
        icon: CalendarCheck,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Assign Manager',
        href: '/assign-manager',
        icon: Users,
    },
    {
        title: 'Manage Hotels',
        href: '/hotels',
        icon: Building2,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    // on récupère les données globales envoyées par le server (Laravel). SharedData est l'interface qui décrit ce que le serveur partage (utilisateur connecté, ses rôles...)
    const { auth } = usePage<SharedData>().props;
    // on récupère l'utlilisateur
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';
    let mainItems: NavItem[];

    if (user?.role === 'manager' && !user?.tenant_id) {
        mainItems = [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        ];
    } else {
        mainItems = isAdmin ? adminNavItems : managerNavItems;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
