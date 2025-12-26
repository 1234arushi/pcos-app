"use client"

import { useState, useEffect } from "react";
import Card from "../components/card";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const e = params.get("email");
        if (e) setEmail(e);
    }, []);

    async function handleLogin() {
        if (!email || !password) {
            return setMsg("Email and password required");
        }
        setMsg("")
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
            if (!res.ok) {
                setMsg(data.msg ?? "Invalid Credentials")
                return;

            }
            setMsg(data.msg ?? "Login Successfull")



        } catch (e) {
            setMsg("Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    return (
        //React Fragment to disturb existing layout
        <>
            {
                msg && (
                    <div className="fixed top-4 left-1/2 -translate-x-1/2 
                    bg-red-100 text-red-700 border border-red-300 
                    rounded-md px-4 py-2 shadow-md text-sm z-50">
                        {msg}
                    </div>
                )
            }
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
        </>

    );
}