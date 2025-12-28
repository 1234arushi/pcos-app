"use client"

import { useState, useEffect } from "react";
import Card from "../../components/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const e = params.get("email");
        if (e) setEmail(e);
    }, []);

    async function handleLogin() {
        if (!email || !password) {
            return toast.error("Email and password required");
        }
        setLoading(true)//to prevent double clicks

        try {
            const res = await fetch("http://localhost:8080/pcos/v1/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const data = await res.json();
            // case 1 → backend returned success=false
            if (!data.success) {
                toast.error(data.msg ?? "Invalid email/password");
                return;
            }

            // case 2 → network or HTTP error
            if (!res.ok) {
                toast.error("Something went wrong");
                return;
            }
            toast.success(data.msg ?? "Login successfull");
            const token = data.data?.token// ? -> optional chaining,because if data.data is undefined then accessing token would give error
            if (token) {
                console.log("Redirecting to patients...");
                localStorage.setItem("auth_token", token);
                router.push("/patients");
            }



        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    return (
        //React Fragment to disturb existing layout

        <Card>
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

            <input
                className="border w-full px-3 py-2 rounded mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                className="border w-full px-3 py-2 rounded mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded py-2"
            >
                {loading ? "Logging in..." : "Login"}
            </button>


        </Card>


    );
}