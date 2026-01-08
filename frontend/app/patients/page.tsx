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
    const [analysisResult, setAnalysisResult] = useState<{
        patientId: number | null;
        probability: number | null;

    }>();

    const [showAnalysisForm, setShowAnalysisForm] = useState(false);//false ->disabled ,here it means that form is hidden
    const [selectedPatient, setSelectedPatient] = useState<number | null>(null)
    const [analysis, setAnalysis] = useState(
        {

            age: "",//they are strings,because 'inputs' read texts
            menstrual_days: "",
            weight: "",
            height: "",
            bmi: "",
            waist: "",
            marriage_yrs: "",
            skin_darkening: 0,
            hair_growth: 0,
            weight_gain: 0,
            cycle_type: 0,
            fast_food: 0,
            pimples: 0,
            hair_loss: 0,
        }
    );
    const symptomFields = [
        { key: "skin_darkening", label: "Skin Darkening " },
        { key: "hair_growth", label: "Hair Growth " },
        { key: "weight_gain", label: "Weight Gain " },
        { key: "cycle_type", label: "Irregular Cycle " },
        { key: "fast_food", label: "Fast Food Intake " },
        { key: "pimples", label: "Pimples " },
        { key: "hair_loss", label: "Hair Loss " },

    ];
    useEffect(() => {
        const w = Number(analysis.weight);
        const h = Number(analysis.height);
        if (!w || !h) {
            setAnalysis((a) => ({ ...a, bmi: "" }));
            return
        }


        const bmiVal = w / ((h / 100) ** 2);
        setAnalysis((a) => ({ ...a, bmi: bmiVal.toFixed(2) }))//toFixed ->setting how many decimal digits to be shown

    }, [analysis.weight, analysis.height]);


    //useEffect(() => {},[]) -> syntax

    async function fetchPatients() {
        try {
            const token = localStorage.getItem("auth_token") ?? "";//fixed token : string|null issue
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/pcos/patient/list/`, {
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/pcos/patient/create/`, {
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
    async function handleAnalysis() {
        if (!selectedPatient) return;
        try {
            const token = localStorage.getItem("auth_token") ?? "";
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE}/pcos/patient/analysis/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify({
                        patient_id: selectedPatient,
                        symptoms: {
                            age: Number(analysis.age),
                            menstrual_days: Number(analysis.menstrual_days),
                            weight: Number(analysis.weight),
                            waist: Number(analysis.waist),
                            bmi: Number(analysis.bmi),
                            skin_darkening: Number(analysis.skin_darkening),
                            hair_growth: Number(analysis.hair_growth),
                            weight_gain: Number(analysis.weight_gain),
                            cycle_type: Number(analysis.cycle_type),
                            fast_food: Number(analysis.fast_food),
                            pimples: Number(analysis.pimples),
                            hair_loss: Number(analysis.hair_loss),
                            marriage_yrs: Number(analysis.marriage_yrs)

                        },
                    })
                }
            );
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.msg ?? "Error in analysis");
                return;
            }
            toast.success(`Risk : ${data.data.risk_label} | Probability: ${(data.data.probability * 100).toFixed(1)}%`);
            setAnalysisResult({
                patientId: selectedPatient!,// ! ->means it will never be null
                probability: data.data.probability


            })
            setShowAnalysisForm(false);

        } catch {
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
            {showAnalysisForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-3xl space-y-4 shadow-xl">
                        <h3 className="font-semibold text-lg">
                            PCOS Analysis - Patient #{selectedPatient}
                        </h3>
                        {/* tailwind css below */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                className="border p-2"
                                placeholder="Age"
                                type="number"
                                value={analysis.age}
                                onChange={(e) =>
                                    setAnalysis({ ...analysis, age: e.target.value })
                                }

                            />
                            <input
                                className="border p-2"
                                placeholder="Menstrual Days"
                                type="number"
                                value={analysis.menstrual_days}
                                onChange={(e) =>
                                    setAnalysis({ ...analysis, menstrual_days: e.target.value })
                                }
                            />

                            <input
                                className="border p-2"
                                placeholder="Weight (kg)"
                                type="number"
                                value={analysis.weight}
                                onChange={(e) =>
                                    setAnalysis({ ...analysis, weight: e.target.value })
                                }
                            />
                            <input
                                className="border p-2"
                                placeholder="Height (cm)"
                                type="number"
                                value={analysis.height}
                                onChange={(e) =>
                                    setAnalysis({ ...analysis, height: e.target.value })
                                }
                            />
                            <input
                                className="border p-2 bg-gray-100"
                                disabled
                                value={analysis.bmi}
                                placeholder="BMI"
                            />

                            <input
                                className="border p-2"
                                placeholder="Waist (inch)"
                                type="number"
                                value={analysis.waist}
                                onChange={(e) =>
                                    setAnalysis({ ...analysis, waist: e.target.value })
                                }
                            />
                            <input
                                className="border p-2"
                                placeholder="Marriage Years"
                                type="number"
                                value={analysis.marriage_yrs}
                                onChange={(e) =>
                                    setAnalysis({ ...analysis, marriage_yrs: e.target.value })
                                }
                            />

                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {
                                symptomFields.map((f) => (
                                    <div key={f.key} className="flex flex-col">
                                        <label className="text-sm text-gray-600">{f.label}</label>

                                        <select

                                            className="border rounded p-2"
                                            value={(analysis as any)[f.key]}
                                            onChange={(e) =>
                                                setAnalysis({ ...analysis, [f.key]: Number(e.target.value) })
                                            }

                                        >
                                            <option value={0}>No</option>
                                            <option value={1}>Yes</option>

                                        </select>
                                    </div>
                                ))
                            }

                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAnalysis}
                                className="bg-blue-600 text-white px-4 py-2 rounded"

                            >
                                Run Analysis

                            </button>
                            <button
                                onClick={() => setShowAnalysisForm(false)}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
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
                            <th className="border px-4 py-2 text-left">Analysis</th>
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
                                    <td className="border px-4 py-2">
                                        <div className="flex flex-col gap-1">
                                            <button
                                                // ?. -> optional chaining so that if analysisResult is undefined
                                                // app won't crash
                                                disabled={analysisResult?.patientId === p.patient_id}


                                                onClick={() => {
                                                    setSelectedPatient(p.patient_id);
                                                    setShowAnalysisForm(true);

                                                }}
                                                className={`px-3 py-1 rounded text-white ${analysisResult?.patientId === p.patient_id
                                                        ? "bg-gray-400 cursor-not-allowed"//grey and disabled
                                                        : "bg-purple-600"//normal purple button
                                                    }`}
                                            >
                                                PCOS Analysis
                                            </button>
                                            {analysisResult?.patientId === p.patient_id && (
                                                <h2 className="text-green-700 font-semibold">
                                                    {(analysisResult.probability! * 100).toFixed(1)}%

                                                </h2>
                                            )}
                                        </div>



                                    </td>

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