import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-5xl">

                {/* Top Logo */}
                {/* <div className="flex justify-center mb-6">
                    <img
                        src="/images/logo.webp"
                        alt="Logo"
                        className="w-40"
                    />
                </div> */}

                {/* Card */}
                <div className="overflow-hidden bg-white shadow-xl sm:rounded-2xl p-5">
                    {children}
                </div>

            </div>
        </div>
    );
}
