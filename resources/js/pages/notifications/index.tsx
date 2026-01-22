import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CalendarX,
    Check,
    Clock,
    Info,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    booking_id: number | null;
    is_read: boolean;
    created_at: string;
}

export default function Notifications() {
    const { notifications = [], info_message } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (info_message?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [info_message]);

    const handleMarkAsRead = (id: number) => {
        router.post(
            `/notifications/${id}/mark-read`,
            {},
            {
                preserveScroll: true, // Évite que la page ne remonte en haut
                preserveState: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(`/notifications/${id}`, {
            preserveState: false,
        });
    };

    const handleMarkAllRead = () => {
        router.post(
            '/notifications/mark-all-read',
            {},
            {
                preserveState: false,
            },
        );
    };

    const notificationList = Array.isArray(notifications) ? notifications : [];

    const unreadCount = notificationList.filter(
        (n: Notification) => !n.is_read,
    ).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'booking_expired':
                return (
                    <CalendarX
                        className="text-red-600 dark:text-red-400"
                        size={24}
                    />
                );
            case 'booking_ending_soon':
                return (
                    <AlertTriangle
                        className="text-yellow-600 dark:text-yellow-400"
                        size={24}
                    />
                );
            default:
                return (
                    <Info
                        className="text-blue-600 dark:text-blue-400"
                        size={24}
                    />
                );
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'booking_expired':
                return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950';
            case 'booking_ending_soon':
                return 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950';
            default:
                return 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950';
        }
    };

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Notifications', href: '/notifications' }]}
        >
            <Head title="Notifications" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="text-blue-500" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold">
                                Notifications
                            </h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    You have {unreadCount} unread notification
                                    {unreadCount !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Button onClick={handleMarkAllRead} variant="outline">
                            Mark all as read
                        </Button>
                    )}
                </div>

                {showSuccess && info_message?.success && (
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-green-100 px-4 py-3 text-green-800">
                        <span>{info_message.success}</span>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="ml-4 text-lg font-bold hover:text-green-600"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="space-y-3">
                    {notificationList.length === 0 ? (
                        <Card className="text-center">
                            <Bell
                                size={48}
                                className="mx-auto mb-4 text-gray-300"
                            />
                            <h2 className="mb-2 text-xl font-semibold text-gray-600">
                                No notifications
                            </h2>
                            <p className="text-gray-500">
                                You're all caught up!
                            </p>
                        </Card>
                    ) : (
                        notificationList.map((notification: Notification) => (
                            <Card
                                key={notification.id}
                                className={`relative border-l-4 p-4 transition-all hover:shadow-md ${getNotificationColor(notification.type)} ${
                                    !notification.is_read
                                        ? 'border-l-blue-500 font-medium shadow-sm'
                                        : 'border-l-gray-300 opacity-60 grayscale-[0.3]'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-1 items-start gap-3">
                                        <div className="flex shrink-0 items-center justify-center">
                                            {getNotificationIcon(
                                                notification.type,
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                                                {notification.title}
                                            </h3>
                                            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <Clock size={12} />
                                                <span>
                                                    {notification.created_at}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {!notification.is_read && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                title="Mark as read"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id,
                                                    )
                                                }
                                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400"
                                            >
                                                <Check size={18} />
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            title="Delete"
                                            onClick={() =>
                                                handleDelete(notification.id)
                                            }
                                            className="h-8 w-8 p-0 text-gray-400 hover:bg-red-100 hover:text-red-600"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </div>
                                {!notification.is_read && (
                                    <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500"></div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
