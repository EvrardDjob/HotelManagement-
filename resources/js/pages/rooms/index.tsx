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

// const emptyForm = {
//     room_number: '',
//     type: 'single',
//     price_per_night: '',
//     status: 'available',
// };

export default function Rooms() {
    const { rooms = [], info_message } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Utiliser useForm pour gérer les erreurs automatiquement
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            room_number: '',
            type: 'single',
            price_per_night: '',
            status: 'available',
        });

    useEffect(() => {
        if (info_message?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 10000);
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

    const handleOpenEdit = (room: any) => {
        setData({
            room_number: room.room_number,
            type: room.type,
            price_per_night: room.price_per_night,
            status: room.status,
        });
        clearErrors();
        setIsEdit(true);
        setEditId(room.room_id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        reset();
        clearErrors();
        setIsEdit(false);
        setEditId(null);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (isEdit && editId) {
            put(`/rooms/${editId}`, {
                // preserveState: false,
                onSuccess: () => handleClose(),
            });
        } else {
            post('/rooms', {
                // preserveState: false,
                onSuccess: () => handleClose(),
            });
        }
    };

    const handleDelete = (id: any) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            router.delete(`/rooms/${id}`, {
                // preserveState: false,
                preserveScroll: true,
            });
        }
    };

    const roomList = Array.isArray(rooms) ? rooms : [];

    return (
        <AppLayout breadcrumbs={[{ title: 'Rooms', href: '/rooms' }]}>
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
                    <h1 className="text-2xl font-bold">Rooms</h1>
                    <Button onClick={handleOpenAdd}>Add Room</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg border text-sm">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Room #
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Type
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Price/Night
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Status
                                </th>
                                <th className="px-4 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomList.map((room: any) => (
                                <tr
                                    key={room.room_id}
                                    className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700"
                                >
                                    <td className="px-4 py-2">
                                        {room.room_number}
                                    </td>
                                    <td className="px-4 py-2 capitalize">
                                        {room.type}
                                    </td>
                                    <td className="px-4 py-2">
                                        {room.price_per_night}
                                    </td>
                                    <td className="px-4 py-2 capitalize">
                                        {room.status}
                                    </td>
                                    <td className="flex gap-2 px-4 py-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenEdit(room)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(room.room_id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Update Room' : 'Add Room'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="room_number">Room Number</Label>
                            <Input
                                id="room_number"
                                name="room_number"
                                value={data.room_number}
                                onChange={(e) =>
                                    setData('room_number', e.target.value)
                                }
                                required
                            />
                            {errors.room_number && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.room_number}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(v) => setData('type', v)}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">
                                        Single
                                    </SelectItem>
                                    <SelectItem value="double">
                                        Double
                                    </SelectItem>
                                    <SelectItem value="suite">Suite</SelectItem>
                                    <SelectItem value="deluxe">
                                        Deluxe
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="price_per_night">
                                Price per Night
                            </Label>
                            <Input
                                id="price_per_night"
                                name="price_per_night"
                                type="number"
                                value={data.price_per_night}
                                onChange={(e) =>
                                    setData('price_per_night', e.target.value)
                                }
                                required
                            />
                            {errors.price_per_night && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.price_per_night}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="available">
                                        Available
                                    </SelectItem>
                                    <SelectItem value="occupied">
                                        Occupied
                                    </SelectItem>
                                    <SelectItem value="maintenance">
                                        Maintenance
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
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
