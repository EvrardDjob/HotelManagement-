import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function Guests() {
    const { guests = [], info_message } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const {
        data: formData,
        setData: setFormData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        check_in_date: '',
        check_out_date: '',
    });

    useEffect(() => {
        if (info_message?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [info_message]);

    const handleOpenAdd = () => {
        reset();
        clearErrors();
        setIsEdit(false);
        setEditId(null);
        setOpen(true);
    };

    const handleOpenEdit = (guest: any) => {
        setFormData({
            first_name: guest.first_name,
            last_name: guest.last_name,
            email: guest.email,
            phone: guest.phone,
            check_in_date: guest.check_in_date || '',
            check_out_date: guest.check_out_date || '',
        });
        clearErrors();
        setIsEdit(true);
        setEditId(guest.guest_id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
        setIsEdit(false);
        setEditId(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setFormData(e.target.name as any, e.target.value);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (isEdit && editId) {
            put(route('guests.update', editId), {
                onSuccess: () => {
                    handleClose();
                },
            });
        } else {
            post(route('guests.store'), {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };

    const handleDelete = (id: any) => {
        if (window.confirm('Are you sure you want to delete this guest?')) {
            router.delete(route('guests.destroy', id), {
                onSuccess: () => {
                    // success message
                },
            });
        }
    };

    const guestList = Array.isArray(guests) ? guests : [];

    return (
        <AppLayout breadcrumbs={[{ title: 'Guests', href: '/guests' }]}>
            <Card className="mt-6 p-6">
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
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Guests</h1>
                    <Button onClick={handleOpenAdd}>Add Guest</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    First Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Last Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Email
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Phone
                                </th>
                                {/* <th className="px-4 py-2 text-left font-semibold">
                                    Check In
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Check Out
                                </th> */}
                                <th className="px-4 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {guestList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No guests found.
                                    </td>
                                </tr>
                            ) : (
                                guestList.map((guest: any) => (
                                    <tr
                                        key={guest.guest_id}
                                        className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                    >
                                        <td className="px-4 py-2">
                                            {guest.first_name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guest.last_name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guest.email}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guest.phone}
                                        </td>
                                        {/* <td className="px-4 py-2">
                                            {guest.check_in_date || '-'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {guest.check_out_date || '-'}
                                        </td> */}
                                        <td className="flex gap-2 px-4 py-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleOpenEdit(guest)
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handleDelete(guest.guest_id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Guest' : 'Add Guest'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/*Bloc d'erreurs en haut du formulaire */}
                        {/* {Object.keys(errors).length > 0 && (
                            <div className="rounded-lg bg-red-100 px-4 py-3 text-red-800">
                                <p className="font-semibold">
                                    Please fix the following errors:
                                </p>
                                <ul className="mt-2 list-inside list-disc text-sm">
                                    {Object.values(errors).map(
                                        (error: any, index) => (
                                            <li key={index}>{error}</li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        )} */}

                        <div>
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.first_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                            {errors.last_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                        {/* <div>
                            <Label htmlFor="check_in_date">Check In Date</Label>
                            <Input
                                id="check_in_date"
                                name="check_in_date"
                                type="date"
                                value={formData.check_in_date}
                                onChange={handleChange}
                                placeholder="Select check-in date"
                            />
                            {errors.check_in_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.check_in_date}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="check_out_date">
                                Check Out Date
                            </Label>
                            <Input
                                id="check_out_date"
                                name="check_out_date"
                                type="date"
                                value={formData.check_out_date}
                                onChange={handleChange}
                                placeholder="Select check-out date"
                            />
                            {errors.check_out_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.check_out_date}
                                </p>
                            )}
                        </div> */}
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : isEdit
                                      ? 'Update'
                                      : 'Add'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
