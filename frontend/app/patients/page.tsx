"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Patient = {
    patient_id: number;
    name?: string;
    age?: number;
    email?: string;// ? -> means optional field
};

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    //useEffect(() => {},[]) -> syntax
    useEffect(() => {
        async function fetchPatients() {
            try {
                const token = localStorage.getItem("auth_token") ?? "";//fixed token : string|null issue
                const res = await fetch("http://localhost:8080/pcos/patient/list/", {
                    headers: {
                        Authorization: token
                    }
                });
                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.msg ?? "Invalid credentials");
                    return;
                }

                setPatients(data.data ?? data);

            } catch (e) {
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        fetchPatients();
    }, []);// [] -> run only once when screen loads,otherwise if we
    //remove this component again then it wuld keep calling this api

    if (loading) {
        return <p className="p-4">Loading Patients..</p>
    }
    return (
       
        <div className="p-8 space-y-4 w-full">
            <h2 className="text-xl font-semibold">Patient History</h2>
            <div className="overflow-x-auto border rounded-lg w-full">
                <table className="min-w-full w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">Patient ID</th>
                            <th className="border px-4 py-2 text-left">Name</th>
                            <th className="border px-4 py-2 text-left">Age</th>
                            <th className="border px-4 py-2 text-left">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((p) => (
                                // to avoid re-rendering
                                <tr key={p.patient_id}>
                                    <td className="border px-4 py-2">{p.patient_id}</td>
                                    <td className="border px-4 py-2">{p.name ?? "-"}</td>
                                    <td className="border px-4 py-2">{p.age ?? "-"}</td>
                                    <td className="border px-4 py-2">{p.email ?? "-"}</td>

                                </tr>
                            ))

                        ) : (
                            //empty state row
                            <tr>
                                <td
                                    colSpan={4}
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No Patients Yet
                                </td>
                            </tr>
                        )

                        }
                    </tbody>
                </table>

            </div>



        </div>
    )

}