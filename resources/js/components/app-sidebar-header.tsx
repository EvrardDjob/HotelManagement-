import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';

import { route } from 'ziggy-js';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    // retrieve the number of notification
    const { unreadNotifications } = usePage().props as any;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* left bloc : Sidebar + Breadcrumbs */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* right bloc : Cloche de notification */}
            <div className="flex items-center">
                <Link
                    href={route('notifications.index')}
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-sidebar-border/50 bg-background text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    <Bell size={18} className="opacity-80" />

                    {unreadNotifications > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 mr-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 pt-0.5 text-[10px] font-bold text-white ring-2 ring-background">
                            {unreadNotifications > 9
                                ? '9+'
                                : unreadNotifications}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
