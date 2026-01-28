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
                <section className="mx-auto max-w-5xl px-6 py-15 text-center">
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
                <section className="border-y border-slate-200 bg-slate-50/50 px-6 py-15 transition-colors dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="mx-auto max-w-6xl">
                        {/* Section Header */}
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
                                Everything you need to succeed
                            </h2>
                            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
                                Our platform provides the essential tools to
                                streamline your daily operations and improve
                                guest satisfaction without the complexity.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <FeatureCard
                                icon={<Bell size={28} />}
                                title="Smart Notifications"
                                desc="Stay updated with automated alerts for expired bookings and upcoming check-outs sent directly to your staff."
                                color="blue"
                            />
                            <FeatureCard
                                icon={<ShieldCheck size={28} />}
                                title="Multi-Tenancy"
                                desc="Secure data isolation for different hotel branches or owners, ensuring privacy and organization across your portfolio."
                                color="green"
                            />
                            <FeatureCard
                                icon={<Users size={28} />}
                                title="Guest Management"
                                desc="Keep a detailed record of guests, visit history, and specific preferences to provide a personalized experience."
                                color="purple"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 bg-white px-6 py-12 transition-colors dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="rounded-lg bg-blue-600 p-1.5">
                                    <Bed className="text-white" size={18} />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
                                    {appName}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Empowering hotel owners with cutting-edge
                                management tools since 2026.
                            </p>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                Product
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Multi-Tenancy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h4 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                Support
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal Column */}
                        <div>
                            <h4 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
                                Legal
                            </h4>
                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="transition hover:text-blue-600"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-8 md:flex-row dark:border-slate-800">
                        <p className="text-xs text-slate-500">
                            &copy; {new Date().getFullYear()} {appName}. All
                            rights reserved. Built with Laravel & React.
                        </p>
                        <div className="mt-4 flex gap-6 md:mt-0">
                            <a
                                href="#"
                                className="text-slate-400 transition hover:text-blue-600"
                            >
                                <Users size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-slate-400 transition hover:text-blue-600"
                            >
                                <Bell size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-slate-400 transition hover:text-blue-600"
                            >
                                <ShieldCheck size={20} />
                            </a>
                        </div>
                    </div>
                </div>
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
        /* Added overflow-hidden here to clip the accent line to the rounded corners */
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-500">
            <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${colors[color]}`}
            >
                {icon}
            </div>

            <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                {title}
            </h3>

            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                {desc}
            </p>

            {/* Accent line - now perfectly clipped by the parent's overflow-hidden */}
            <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </div>
    );
}
