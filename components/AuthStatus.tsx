"use client";

import { useState, useEffect } from "react";

export default function AuthStatus() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    data?: any;
  }>({
    loading: true
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/debug");
        const data = await res.json();
        setStatus({ loading: false, data });
      } catch (error) {
        console.log(error)
        setStatus({ loading: false});
      }
    }

    checkAuth();
  }, []);

  if (status.loading) {
    return <div className="p-4 bg-gray-100 rounded-md">Checking authentication status...</div>;
  }

  if (status.error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded-md">Error: {status.error}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="font-bold text-lg mb-2">Authentication Status</h3>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Authenticated:</span>{" "}
          {status.data.authenticated ? (
            <span className="text-green-600">Yes ✅</span>
          ) : (
            <span className="text-red-600">No ❌</span>
          )}
        </div>
        
        {status.data.authenticated && status.data.user && (
          <div>
            <div><span className="font-semibold">User ID:</span> {status.data.user.userId}</div>
            <div><span className="font-semibold">Email:</span> {status.data.user.email}</div>
            <div><span className="font-semibold">Role:</span> {status.data.user.role}</div>
          </div>
        )}
        
        {!status.data.authenticated && status.data.message && (
          <div className="text-red-600">{status.data.message}</div>
        )}
        
        <div className="mt-4">
          <details>
            <summary className="cursor-pointer text-blue-600">Debug Information</summary>
            <pre className="mt-2 p-2 bg-gray-800 text-white text-xs rounded overflow-auto max-h-60">
              {JSON.stringify(status.data, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
