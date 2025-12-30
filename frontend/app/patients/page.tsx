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
    const [showForm, setShowForm] = useState(false);
    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        phone: "",
        email: ""
    })

    //useEffect(() => {},[]) -> syntax

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
    useEffect(() => {
        fetchPatients();
    }, []);
    // [] -> run only once when screen loads,otherwise if we
    //remove this component again then it wuld keep calling this api

    async function handleCreate() {
        try {
            const token = localStorage.getItem("auth_token") ?? "";
            const res = await fetch("http://localhost:8080/pcos/patient/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    name: newPatient.name,
                    age: Number(newPatient.age),
                    phone: newPatient.phone,
                    email: newPatient.email
                })
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.msg ?? "Could not create patient");
                return;
            }
            toast.success("Patient created successfully");
            fetchPatients();//refresh list
            setShowForm(false);

        } catch (e) {
            toast.error("Something went wrong");
        }
    }

    if (loading) {
        return <p className="p-4">Loading Patients..</p>
    }
    return (

        <div className="p-8 space-y-4 w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Patient History</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-pink-600 text-white px-4 py-2 rounded">
                    + Create Patient

                </button>
            </div>
            {/* form */}
            {showForm && (
                <div className="border p-4 rounded bg-white space-y-3">
                    <h3 className="font-semibold text-lg">Create Patient</h3>
                    <input
                        className="border p-2 w-full"
                        placeholder="Name"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}

                    />
                    <input
                        type="number"
                        className="border p-2 w-full"
                        placeholder="Age"
                        value={newPatient.age}
                        onChange={(e) =>
                            setNewPatient({ ...newPatient, age: e.target.value })
                        }
                    />

                    <input
                        className="border p-2 w-full"
                        placeholder="Email"
                        value={newPatient.email}
                        onChange={(e) =>
                            setNewPatient({ ...newPatient, email: e.target.value })
                        }
                    />
                    <input
                        className="border p-2 w-full"
                        placeholder="Phone"
                        value={newPatient.phone}
                        //e -> event object(sent by browser)
                        onChange={(e) =>
                            // ..newPatient -> spread operator(to copy existing fields) and copy it into new object
                            setNewPatient({ ...newPatient, phone: e.target.value })
                        }
                    />
                    {/* places button side by side */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}//calls create patient backend api
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >Save


                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

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