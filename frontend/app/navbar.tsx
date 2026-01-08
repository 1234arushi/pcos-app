"use client";
//navbar -> a common top-bar that has app's title and logout button
import Link from "next/link";

export default function Navbar(){
    return(
        <div className="w-full flex justify-between px-6 py-3 border-b">
            <h2 className="font-semibold text-lg"></h2>
            <Link
            href="/auth/logout"
            className="px-3 py-1 rounded bg-red-500 text-white">
                Logout
            </Link>
        </div>
    );

}