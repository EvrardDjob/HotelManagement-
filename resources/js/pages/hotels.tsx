import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Building2, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

// It allows us to generate Laravel URLs on the JS side.
import { route } from 'ziggy-js';

interface Hotel {
    tenant_id: number;
    hotel_name: string;
    address: string;
    contact_number: string;
    created_at: string;
}

export default function ManageHotels() {
    const { hotels } = usePage().props as unknown as { hotels: Hotel[] };
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // --- MODIFICATION : Utilisation de useForm au lieu de useState ---
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            hotel_name: '',
            address: '',
            contact_number: '',
        });

    const handleOpen = () => {
        reset();
        clearErrors();
        setIsEdit(false);
        setEditId(null);
        setOpen(true);
    };

    const handleOpenEdit = (hotel: Hotel) => {
        setData({
            hotel_name: hotel.hotel_name,
            address: hotel.address,
            contact_number: hotel.contact_number,
        });
        clearErrors();
        setIsEdit(true);
        setEditId(hotel.tenant_id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
        setIsEdit(false);
        setEditId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && editId) {
            put(route('hotels.update', editId), {
                onSuccess: () => handleClose(),
            });
        } else {
            post(route('hotels.store'), {
                onSuccess: () => handleClose(),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Manage Hotels', href: '/hotels' }]}>
            <Head title="Manage Hotels" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Building2 className="mr-2 text-blue-500" size={32} />
                        <h1 className="text-2xl font-bold">Manage Hotels</h1>
                    </div>
                    <Button onClick={handleOpen} className="gap-2">
                        <Plus size={18} /> Add Hotel
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border shadow dark:border-gray-700">
                    <table className="min-w-full bg-white dark:bg-gray-900">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="px-4 py-2 text-left">
                                    Hotel Name
                                </th>
                                <th className="px-4 py-2 text-left">Address</th>
                                <th className="px-4 py-2 text-left">Contact</th>
                                <th className="px-4 py-2 text-left">
                                    Created At
                                </th>
                                <th className="px-4 py-2 text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels && hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <tr
                                        key={hotel.tenant_id}
                                        className="border-t dark:border-gray-700"
                                    >
                                        <td className="px-4 py-2 font-medium">
                                            {hotel.hotel_name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {hotel.address}
                                        </td>
                                        <td className="px-4 py-2">
                                            {hotel.contact_number}
                                        </td>
                                        <td className="px-4 py-2">
                                            {hotel.created_at
                                                ? new Date(
                                                      hotel.created_at,
                                                  ).toLocaleDateString()
                                                : ''}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mr-2"
                                                onClick={() =>
                                                    handleOpenEdit(hotel)
                                                }
                                            >
                                                <Pencil size={18} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        No hotels found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {isEdit ? 'Edit Hotel' : 'Add Hotel'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    className="mb-1 block font-medium"
                                    htmlFor="hotel_name"
                                >
                                    {' '}
                                    Hotel Name{' '}
                                </label>
                                <input
                                    id="hotel_name"
                                    name="hotel_name"
                                    type="text"
                                    value={data.hotel_name}
                                    onChange={(e) =>
                                        setData('hotel_name', e.target.value)
                                    }
                                    className="w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />
                                {errors.hotel_name && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.hotel_name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label
                                    className="mb-1 block font-medium"
                                    htmlFor="address"
                                >
                                    {' '}
                                    Address{' '}
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    className="w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />
                                {errors.address && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.address}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label
                                    className="mb-1 block font-medium"
                                    htmlFor="contact_number"
                                >
                                    Contact Number
                                </label>
                                <input
                                    id="contact_number"
                                    name="contact_number"
                                    type="text"
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            'contact_number',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                                />
                                {errors.contact_number && (
                                    <div className="mt-1 text-xs text-red-500">
                                        {errors.contact_number}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
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
                                        ? isEdit
                                            ? 'Saving...'
                                            : 'Adding...'
                                        : isEdit
                                          ? 'Save Changes'
                                          : 'Add Hotel'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
