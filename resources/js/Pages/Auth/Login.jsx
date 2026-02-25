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
            <div className="relative mx-auto max-w-5xl">

                {/* ================= RIGHT INFO CARD ================= */}
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-1 items-center gap-8 px-8 py-12 lg:px-12 lg:py-14 lg:pr-[500px]">

                        {/* LEFT TEXT SECTION */}
                        <div className="flex flex-col items-center justify-center text-center lg:text-center">
                            <img src="/images/logo.webp" alt="Company Logo" className="mx-auto lg:mx-0 w-[12rem] object-contain" />
                            <h1 className="text-xl lg:text-3xl font-bold text-slate-900 font-bree">
                                Explore Enterprise Suite (EES)
                            </h1>
                            <p className="mt-3 text-sm lg:text-base text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                Enter your credentials to access the Enterprise Suite portal.
                                Manage internal tools, employee services, and secure
                                enterprise workflows from one centralized platform.
                            </p>
                        </div>

                        {/* RIGHT IMAGE */}
                        {/* <div className="hidden lg:flex justify-end">
                            <img
                                src="/images/login-img.webp"
                                alt="Login Illustration"
                                className="w-[22rem] max-w-full object-contain transition-transform duration-300 hover:scale-[1.03]"
                            />
                        </div> */}
                    </div>
                </div>

                {/* ================= LOGIN CARD (OVERLAY) ================= */}
                <div className="mt-6 lg:mt-0 lg:absolute lg:right-[3rem] lg:top-1/2 lg:-translate-y-1/2 w-full lg:w-[380px] z-20">
                    <div className="rounded-xl bg-white shadow-2xl border border-slate-200 p-7">
                        <div className="text-center mb-2">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Welcome Back..
                            </h2>
                        </div>

                        {status && (
                            <div className="mb-4 text-sm text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">

                            {/* Email */}
                            <div>
                                <TextInput
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={data.email}
                                    className="block w-full rounded-lg border-slate-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 transition"
                                    placeholder="Enter email"
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
                                    className="block w-full rounded-lg border-slate-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 transition"
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 text-slate-600">
                                    <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                                    Remember me
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-slate-500 hover:text-slate-900"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>

                            {/* Login Button */}
                            <PrimaryButton
                                className="w-full justify-center bg-[#0A4A87] hover:bg-[#083a6b] py-3 text-white transition"
                                disabled={processing}
                            >
                                LOG IN
                            </PrimaryButton>

                            {/* Footer */}
                            <div className="text-center text-xs text-gray-500 space-x-4 relative">

                                {/* Terms */}
                                <div className="relative inline-block group cursor-pointer">
                                    <span className="hover:text-gray-700">Terms of Use</span>

                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                        Use of this system is restricted to authorized personnel only. 
                                        All activities may be monitored and logged.
                                    </div>
                                </div>

                                <span>|</span>

                                {/* Privacy */}
                                <div className="relative inline-block group cursor-pointer">
                                    <span className="hover:text-gray-700">Privacy Policy</span>

                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 rounded-lg bg-gray-800 text-white text-[11px] px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                        Personal data is processed securely and in accordance with 
                                        company data protection standards.
                                    </div>
                                </div>

                                <div className="mt-3 text-slate-800 font-semibold">
                                    Developed and Maintained by IT Department of Explore Holdings © {new Date().getFullYear()}
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </GuestLayout>
    );
}
