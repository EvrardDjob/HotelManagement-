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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

// const emptyForm = {
//     guest_id: '',
//     room_id: '',
//     check_in_date: '',
//     check_out_date: '',
// };

export default function Bookings() {
    const {
        bookings = [],
        guests = [],
        rooms = [],
        info_message,
    } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    // const [form, setForm] = useState(emptyForm);
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
        guest_id: '',
        room_id: '',
        check_in_date: '',
        check_out_date: '',
    });

    const guestList = Array.isArray(guests) ? guests : [];
    const roomList = Array.isArray(rooms) ? rooms : [];
    const bookingList = Array.isArray(bookings) ? bookings : [];

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (info_message?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [info_message]);

    // Only allow available rooms for selection and not already booked by another guest or by the same guest on the same day
    const availableRooms = roomList.filter((r: any) => {
        if (r.status !== 'available') return false;
        // If this is an edit, allow the current booking's room
        if (
            isEdit &&
            formData.room_id &&
            String(r.room_id) === String(formData.room_id)
        )
            return true;
        // Exclude rooms that have any booking by another guest
        const isBooked = bookingList.some((b: any) => {
            if (String(b.room_id) !== String(r.room_id)) return false;
            // If editing, allow the current booking's room for the current booking
            if (isEdit && editId && b.booking_id === editId) return false;
            return true;
        });
        if (isBooked) return false;
        // Prevent the same guest from booking two rooms for the same check-in date
        if (formData.guest_id && formData.check_in_date) {
            const guestHasBooking = bookingList.some((b: any) => {
                if (isEdit && editId && b.booking_id === editId) return false;
                return (
                    String(b.guest_id) === String(formData.guest_id) &&
                    b.check_in_date === formData.check_in_date
                );
            });
            if (guestHasBooking) return false;
        }
        return true;
    });

    const handleOpenAdd = () => {
        // setForm(emptyForm);
        reset();
        clearErrors();
        setIsEdit(false);
        setEditId(null);
        setOpen(true);
    };

    const handleOpenEdit = (booking: any) => {
        setFormData({
            guest_id: String(booking.guest_id),
            room_id: String(booking.room_id),
            check_in_date: booking.check_in_date || '',
            check_out_date: booking.check_out_date || '',
        });
        clearErrors();
        setIsEdit(true);
        setEditId(booking.booking_id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        // setForm(emptyForm);
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

        const selectedRoom = rooms.find(
            (r: any) => String(r.room_id) === String(formData.room_id),
        );

        if (!selectedRoom || selectedRoom.status !== 'available') {
            alert('Please select an available room.');
            return;
        }

        if (isEdit && editId) {
            put(route('bookings.update', editId), {
                onSuccess: () => {
                    handleClose();
                    router.reload({ only: ['rooms'] });
                },
            });
        } else {
            post(route('bookings.store'), {
                onSuccess: () => {
                    handleClose();
                    router.reload({ only: ['rooms'] });
                },
            });
        }
    };

    const handleDelete = (id: any) => {
        if (
            window.confirm('Are you sure you want to delete this reservation?')
        ) {
            router.delete(route('bookings.destroy', id), {
                onSuccess: () => {
                    // success message
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Bookings', href: '/bookings' }]}>
            <Card className="mt-6 p-6">
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
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Bookings</h1>
                    <Button onClick={handleOpenAdd}>Add Booking</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Guest
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Room
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Check In
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Check Out
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        Not reservations found.
                                    </td>
                                </tr>
                            ) : (
                                bookingList.map((booking: any) => {
                                    const guest = guestList.find(
                                        (g: any) =>
                                            String(g.guest_id) ===
                                            String(booking.guest_id),
                                    );
                                    const room = roomList.find(
                                        (r: any) =>
                                            String(r.room_id) ==
                                            String(booking.room_id),
                                    );
                                    return (
                                        <tr
                                            key={booking.booking_id}
                                            className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                        >
                                            <td className="px-4 py-2">
                                                {guest
                                                    ? `${guest.first_name} ${guest.last_name}`
                                                    : booking.guest_id}
                                            </td>
                                            <td className="px-4 py-2">
                                                {room
                                                    ? `${room.room_number} | ${room.type} | $${room.price_per_night ? parseInt(room.price_per_night) : 0} | ${room.status.charAt(0).toUpperCase() + room.status.slice(1)}`
                                                    : booking.room_id}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.check_in_date}
                                            </td>
                                            <td className="px-4 py-2">
                                                {booking.check_out_date}
                                            </td>
                                            <td className="flex gap-2 px-4 py-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleOpenEdit(booking)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            booking.booking_id,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Booking' : 'Add Booking'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Affichage des erreurs en haut du formulaire  */}
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
                            <Label htmlFor="guest_id">Guest</Label>
                            <Select
                                value={formData.guest_id}
                                onValueChange={(v) =>
                                    setFormData('guest_id', v)
                                }
                            >
                                <SelectTrigger id="guest_id">
                                    <SelectValue placeholder="Select guest" />
                                </SelectTrigger>
                                <SelectContent>
                                    {guestList.map((g: any) => (
                                        <SelectItem
                                            key={g.guest_id}
                                            value={String(g.guest_id)}
                                        >
                                            {g.first_name} {g.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.guest_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.guest_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="room_id">Room</Label>
                            <Select
                                value={formData.room_id}
                                onValueChange={(v) => setFormData('room_id', v)}
                            >
                                <SelectTrigger id="room_id">
                                    <SelectValue placeholder="Select room" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* CONSERVÉ : Message si aucune chambre disponible */}
                                    {availableRooms.length === 0 ? (
                                        <div className="px-2 py-1 text-sm text-gray-500">
                                            No available rooms
                                        </div>
                                    ) : (
                                        availableRooms.map((r: any) => (
                                            <SelectItem
                                                key={r.room_id}
                                                value={String(r.room_id)}
                                            >
                                                {r.room_number} - {r.type} - $
                                                {r.price_per_night
                                                    ? parseInt(
                                                          r.price_per_night,
                                                      )
                                                    : 0}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.room_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.room_id}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="check_in_date">Check In Date</Label>
                            <Input
                                id="check_in_date"
                                name="check_in_date"
                                type="date"
                                min={today}
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
                                min={formData.check_in_date || today}
                                value={formData.check_out_date}
                                onChange={handleChange}
                                placeholder="Select check-out date"
                            />
                            {errors.check_out_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.check_out_date}
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
                                    ? 'saving...'
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
