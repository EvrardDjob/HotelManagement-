import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager';
    is_active: boolean;
    tenant_id: number | null;
    created_at: string;
}

export default function UserRoles() {
    const { users = [], info_message } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<{
        [key: number]: string;
    }>({});

    useEffect(() => {
        if (info_message?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [info_message]);

    // Initialize selected roles
    useEffect(() => {
        const initialRoles: { [key: number]: string } = {};
        users.forEach((user: User) => {
            initialRoles[user.id] = user.role;
        });
        setSelectedRoles(initialRoles);
    }, [users]);

    const handleRoleChange = (userId: number, newRole: string) => {
        const user = users.find((u: User) => u.id === userId);

        if (newRole !== user?.role) {
            if (
                confirm(
                    `Are you sure you want to change ${user?.name}'s role to ${newRole}? They will be logged out.`,
                )
            ) {
                router.post(
                    route('user-roles.update-role', userId),
                    { role: newRole },
                    {
                        preserveState: false,
                        onError: () => {
                            // Revert the local state if there's an error
                            setSelectedRoles((prev) => ({
                                ...prev,
                                [userId]: user?.role || 'manager',
                            }));
                        },
                    },
                );
            } else {
                // Revert the local state if cancelled
                setSelectedRoles((prev) => ({
                    ...prev,
                    [userId]: user?.role || 'manager',
                }));
            }
        }
    };

    const handleDelete = (userId: number, userName: string) => {
        if (
            confirm(
                `Are you sure you want to delete ${userName}? This action cannot be undone.`,
            )
        ) {
            router.delete(route('user-roles.destroy', userId), {
                preserveState: false,
            });
        }
    };

    const userList = Array.isArray(users) ? users : [];

    return (
        <AppLayout
            breadcrumbs={[{ title: 'User Roles', href: 'user-roles.index' }]}
        >
            <Head title="User Roles" />
            <div className="p-6">
                <div className="mb-4 flex items-center">
                    <Shield className="mr-2 text-blue-500" size={32} />
                    <h1 className="text-2xl font-bold">Manage User Roles</h1>
                </div>

                <Card className="p-6">
                    {showSuccess && info_message?.success && (
                        <div className="mb-4 flex items-center justify-between rounded-lg bg-green-100 px-4 py-3 text-green-800">
                            <span>{info_message.success}</span>
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="ml-4 text-lg font-bold hover:text-green-600"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full rounded-lg border text-sm">
                            <thead className="bg-gray-100 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Current Role
                                    </th>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Registered
                                    </th>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    userList.map((user: User) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                        >
                                            <td className="px-4 py-2 font-medium">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-2">
                                                <Select
                                                    value={
                                                        selectedRoles[
                                                            user.id
                                                        ] || user.role
                                                    }
                                                    onValueChange={(value) => {
                                                        setSelectedRoles(
                                                            (prev) => ({
                                                                ...prev,
                                                                [user.id]:
                                                                    value,
                                                            }),
                                                        );
                                                        handleRoleChange(
                                                            user.id,
                                                            value,
                                                        );
                                                    }}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">
                                                            <div className="flex items-center gap-2">
                                                                <Shield
                                                                    size={14}
                                                                    className="text-purple-600"
                                                                />
                                                                Admin
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="manager">
                                                            <div className="flex items-center gap-2">
                                                                <Shield
                                                                    size={14}
                                                                    className="text-blue-600"
                                                                />
                                                                Manager
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span
                                                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                                                        user.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {user.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-gray-600">
                                                {user.created_at}
                                            </td>
                                            <td className="px-4 py-2">
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            user.id,
                                                            user.name,
                                                        )
                                                    }
                                                    className="gap-1"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
                            <img
                                width="24"
                                height="24"
                                src="https://img.icons8.com/forma-light/24/228BE6/error.png"
                                alt="error"
                                className="mb-1"
                            />
                            Information
                        </h3>
                        <ul className="list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
                            <li>
                                Changing a user's role will log them out
                                immediately.
                            </li>
                            <li>
                                Admins have full access to all hotels and
                                settings.
                            </li>
                            <li>
                                Managers can only access their assigned hotel.
                            </li>
                            <li>
                                You cannot modify your own role or delete
                                yourself.
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
