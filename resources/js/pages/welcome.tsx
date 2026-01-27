import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bed,
    Bell,
    LayoutDashboard,
    Moon,
    ShieldCheck,
    Sun,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

interface Props {
    canRegister?: boolean;
}

export default function Welcome({ canRegister }: Props) {
    // Local state to handle the toggle (This usually connects to your global theme provider)
    const [isDark, setIsDark] = useState(false);
    const { appName } = usePage().props as any;

    useEffect(() => {
        // Check if dark mode is already active on the document
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
            <Head title="Welcome to Grand Horizon" />

            {/* Navigation */}
            <nav className="flex items-center justify-between border-b border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-600 p-2">
                        <Bed className="text-white" size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                        {appName}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {isDark ? (
                            <Sun size={20} className="text-yellow-400" />
                        ) : (
                            <Moon size={20} className="text-slate-600" />
                        )}
                    </button>

                    <Link
                        href={route('login')}
                        className="px-4 py-2 text-sm font-medium transition hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Log in
                    </Link>
                    {canRegister && (
                        <Link
                            href={route('register')}
                            className="hidden rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:block"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main>
                <section className="mx-auto max-w-5xl px-6 py-20 text-center">
                    <h1 className="mb-6 text-5xl leading-tight font-extrabold text-slate-900 md:text-6xl dark:text-white">
                        A Smarter Way to Manage <br />
                        <span className="text-blue-600 dark:text-blue-500">
                            Your Hotel Operations.
                        </span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                        A full-stack Hotel Management System built with Laravel,
                        React, and Inertia.js. Handle bookings, track room
                        status, and receive real-time notifications.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            <LayoutDashboard size={20} />
                            Go to Dashboard
                        </Link>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="border-y border-slate-200 bg-white px-6 py-20 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
                        <FeatureCard
                            icon={<Bell size={24} />}
                            title="Smart Notifications"
                            desc="Stay updated with automated alerts for expired bookings and upcoming check-outs."
                            color="blue"
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={24} />}
                            title="Multi-Tenancy"
                            desc="Secure data isolation for different hotel branches or owners within one platform."
                            color="green"
                        />
                        <FeatureCard
                            icon={<Users size={24} />}
                            title="Guest Management"
                            desc="Keep a detailed record of guests, history, and booking preferences in one place."
                            color="purple"
                        />
                    </div>
                </section>
            </main>

            <footer className="py-10 text-center text-sm text-slate-500 dark:text-slate-500">
                <p>
                    &copy; 2026 Grand Horizon Hotel Management. Built with
                    Laravel & React.
                </p>
            </footer>
        </div>
    );
}

// Small helper component for the cards
function FeatureCard({
    icon,
    title,
    desc,
    color,
}: {
    icon: any;
    title: string;
    desc: string;
    color: string;
}) {
    const colors: any = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return (
        <div className="space-y-4">
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${colors[color]}`}
            >
                {icon}
            </div>
            <h3 className="text-xl font-bold dark:text-white">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{desc}</p>
        </div>
    );
}
