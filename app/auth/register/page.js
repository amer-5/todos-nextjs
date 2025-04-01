"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log(loading);
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (data.error) setError(data.error);
      if (!data.error) localStorage.setItem("token", data.token);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      redirect("/");
      console.log(loading);
    }
  };

  return (
    <div>
      {!loading ? (
        <>
          <input
            type="text"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Register</button>
          <Link href="/auth/login">Already have an account?</Link>
        </>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Page;
