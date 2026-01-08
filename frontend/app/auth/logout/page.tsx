"use client"
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function LogoutPage(){
    const router = useRouter();
    useEffect(()=>{
        //remove token
        localStorage.removeItem("auth_token");
        //redirect
        router.push("/");//verifyEmail screen

    },[router])
    return (
        <div className="p-6">
            <p>Logging you out..</p>
        </div>
    );
}