"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyUserEmail = async () => {
    setLoading(true); // Set loading state

    try {
      const response = await axios.post("/api/auth/users/verifyemail", {
        token,
      });
      setVerified(true);
    } catch (error: any) {
      setError(error.response?.data?.error || "Verification failed"); // Handle potential error messages
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>

      {loading ? (
        <p>Verifying email...</p>
      ) : (
        <>
          {verified && (
            <div>
              <h2 className="text-2xl">Email Verified</h2>
              <Link href="/login">Login</Link>
            </div>
          )}
          {error && (
            <div className="bg-red-500 text-black p-2">
              <h2 className="text-2xl">Error</h2>
              <p>{error}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
