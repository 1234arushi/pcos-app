"use client";//we need UI interactions

import { useState } from "react";//react hook to store values in UI

export default function EmailScreen() {
  const [email, setEmail] = useState("")//initially email is empty,when a value is entered,then using setEmail ->email value gets updated without re-loading
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)//ensures that button is clickable
  //async ->means a function will do some work that takes time like calling an API and we want to wait for it without freezing the UI.
  async function handleContinue() {
    if (!email) {
      return setMsg("Please enter email");
    }
    setLoading(true);
    setMsg("");
    try {
      //fetch -> browser version of Postman
      const res = await fetch(//await -> pause until backend replies
        `http://localhost:8080/pcos/v1/verifyEmail?email=${email}`
      );
      const data = await res.json();
      setMsg(data.msg);
      console.log(data.data?.exists)

      if (data.data?.exists) {//email exists
        //go to login page
        window.location.href = `/login?email=${email}`;
      } else {
        window.location.href = `/signUp?email=${email}`;
      }
    } catch (e) {
      console.log("hy", e)
      setMsg("something went wrong");

    } finally {
      setLoading(false);
    }


  }
  //what user actually sees ->language JSX(javascript + html mix)
  return (
    <div className="p-8 flex flex-col gap-4 max-w-md">
      <h2 className="text-xl font-semibold">Welcome to PCOS App</h2>
      <input
        className="border px-3 py-2 rounded"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleContinue}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded py-2"
        disabled={loading}
      >
        {loading ? "checking.." : "Continue"}

      </button>
      <p>{msg}</p>


    </div>


  );
}