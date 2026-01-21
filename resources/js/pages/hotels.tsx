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
import { Head, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const { hotels } = usePage().props as unknown as {
        hotels: Hotel[];
    };
    const { info_message } = usePage().props as any;
    const [open, setOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            hotel_name: '',
            address: '',
            contact_number: '',
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
                    <h1 className="text-2xl font-bold">Hotels</h1>
                    <Button onClick={handleOpen} className="gap-2">
                        <Plus size={18} /> Add Hotel
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Hotel Name
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Address
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Contact
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Created At
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {hotels && hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <tr
                                        key={hotel.tenant_id}
                                        className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                    >
                                        <td className="px-4 py-2">
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
                                                : '-'}
                                        </td>
                                        <td className="flex gap-2 px-4 py-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleOpenEdit(hotel)
                                                }
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No hotels found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Hotel' : 'Add Hotel'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="hotel_name">Hotel Name</Label>
                            <Input
                                id="hotel_name"
                                name="hotel_name"
                                value={data.hotel_name}
                                onChange={(e) =>
                                    setData('hotel_name', e.target.value)
                                }
                                required
                            />
                            {errors.hotel_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.hotel_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                required
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="contact_number">
                                Contact Number
                            </Label>
                            <Input
                                id="contact_number"
                                name="contact_number"
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData('contact_number', e.target.value)
                                }
                                required
                            />
                            {errors.contact_number && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.contact_number}
                                </p>
                            )}
                        </div>

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
