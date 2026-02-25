// export default function GuestLayout({ children }) {
//     return (
//         <div className="relative min-h-screen overflow-hidden bg-slate-100 flex items-center justify-center px-4 py-10">
//             {/* <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40" /> */}
//             <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-purple-200/30" />
//             <div className="pointer-events-none absolute top-10 right-10 h-40 w-40 rounded-full bg-blue-200/20" />

//             <div className="w-full max-w-6xl relative">
//                 {children}
//             </div>
//         </div>
//     );
// }


export default function GuestLayout({ children }) {
    return (
        <div
            className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/login-bg-1.jpg')", 
            }}
        >
            {/* <div className="absolute inset-0 bg-black/10"></div> */}

            <div className="w-full max-w-6xl relative z-10">
                {children}
            </div>
        </div>
    );
}