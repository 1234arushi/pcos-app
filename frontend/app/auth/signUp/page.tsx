//http://localhost:3000/signUp?email=xyz@gmail.com ->this is frontend API and it loads signup page


//file => app/signUp/page.tsx, so URL => /signUp
"use client"
import { useState, useEffect } from "react";
import Card from "../../components/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";



export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const e = params.get("email");
        if (e) setEmail(e);

    }, []);

    async function handleSignup() {
        if (!name || !email || !password) {
            return toast.error("All fields are required");
        }
        setLoading(true);


        try {
            const res = await fetch(
                "http://localhost:8080/pcos/v1/signUp/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"//explicitly mentioning that json body is sent
                },
                body: JSON.stringify({//data in form is converted to json format
                    name,
                    email,
                    password
                }),
            });
            const data = await res.json();
            toast.success(data.msg ?? "Sign-Up successfull");;//if backend did'nt send any message then success message from frontend
            const token = data.data?.token
            if (token) {
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

        <Card>

            <h2 className="text-xl font-semibold mb-4 text-center">Create account</h2>
            <input
                className="border w-full px-3 py-2 rounded mb-3"
                placeholder="Name"
                value={name}//input display when onchange works and sets name var
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="border w-full px-3 py-2 rounded mb-3"
                placeholder="Email"
                value={email}
                disabled
            />
            <input
                type="password"
                className="border w-full px-3 py-2 rounded mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded py-2"
            >
                {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p className="mt-3 text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <a href={`/login?email=${email}`} className="text-pink-600 underline">
                    Login
                </a>
            </p>


        </Card>



    );
}
