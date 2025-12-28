
import { Toaster } from "react-hot-toast"
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-pink-200 flex items-center justify-center">
            <div className="max-w-md w-full p-6">
                {children}
                <Toaster position="top-right" />

            </div>
        </div>
    );
}
