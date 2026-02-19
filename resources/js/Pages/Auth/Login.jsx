import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="grid grid-cols-1 md:grid-cols-2">

                {/* Left Column - Image */}
                <div className="hidden md:flex items-center justify-center p-10">
                    <img
                        src="/images/login-img.webp"
                        alt="Login Illustration"
                        className="max-h-100 object-contain transition-transform duration-300 hover:scale-105"
                    />
                </div>

                {/* Right Column - Form */}
                <div className="p-5 sm:p-5 flex items-center justify-center">
                    <div className="w-full max-w-md">
                       <div className="flex justify-center mb-6">
                            <img
                                src="/images/logo.webp"
                                alt="ERP Logo"
                                className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {status && (
                            <div className="mb-4 text-sm text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">

                            {/* Username */}
                            <div>
                                <TextInput
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={data.email}
                                    className="block w-full rounded-lg border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 transition"
                                    placeholder="Username"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full rounded-lg border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 transition"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                    />
                                    <span className="text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-gray-500 hover:text-gray-900"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Button */}
                            <PrimaryButton
                                className="w-full justify-center bg-blue-950 py-3 text-white hover:bg-blue-800 transition"
                                disabled={processing}
                            >
                                Log in
                            </PrimaryButton>

                            {/* Footer */}
                            <div className="text-center text-xs text-gray-500 space-x-4 relative">

                                {/* Terms */}
                                <div className="relative inline-block group cursor-pointer">
                                    <span className="hover:text-gray-700">Terms of Use</span>

                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-md bg-gray-800 text-white text-[11px] px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                        Use of this system is restricted to authorized personnel only. 
                                        All activities may be monitored and logged.
                                    </div>
                                </div>

                                <span>|</span>

                                {/* Privacy */}
                                <div className="relative inline-block group cursor-pointer">
                                    <span className="hover:text-gray-700">Privacy Policy</span>

                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-md bg-gray-800 text-white text-[11px] px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                        Personal data is processed securely and in accordance with 
                                        company data protection standards.
                                    </div>
                                </div>

                                <div className="mt-2 text-black font-extrabold">
                                    Developed and Maintained by IT Department of Explore Vacations © {new Date().getFullYear()}
                                </div>

                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </GuestLayout>
    );
}
