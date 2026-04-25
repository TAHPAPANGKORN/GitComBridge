"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [generatedUrl, setGeneratedUrl] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      const baseUrl = window.location.origin;
      const encodedName = encodeURIComponent(session.user.name);
      setGeneratedUrl(`${baseUrl}/api/graph/${encodedName}`);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="container">
        <p style={{ textAlign: "center" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        🔒 Secure Unified Contribution Graph
      </h1>
      
      <div className="card">
        {!session ? (
          <div style={{ textAlign: "center" }}>
            <h2>Connect your accounts</h2>
            <p>Sign in to securely generate your contribution graph.</p>
            
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
              <button 
                onClick={() => signIn("github")}
                style={{ 
                  backgroundColor: "#24292e", 
                  color: "white", 
                  padding: "0.75rem 1.5rem", 
                  border: "none", 
                  borderRadius: "6px", 
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Connect GitHub
              </button>
              
              <button 
                onClick={() => signIn("gitlab")}
                style={{ 
                  backgroundColor: "#fc6d26", 
                  color: "white", 
                  padding: "0.75rem 1.5rem", 
                  border: "none", 
                  borderRadius: "6px", 
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Connect GitLab
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h2 style={{ margin: 0 }}>Welcome, {session.user?.name}</h2>
                <p style={{ fontSize: "0.9rem", color: "#666" }}>Logged in as {session.user?.email}</p>
              </div>
              <button 
                onClick={() => signOut()}
                style={{ padding: "0.5rem 1rem", borderRadius: "4px", border: "1px solid #ccc", cursor: "pointer" }}
              >
                Sign Out
              </button>
            </div>

            <div style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#e7f3ff", borderRadius: "8px", border: "1px solid #b8daff" }}>
              <h4 style={{ margin: "0 0 1rem 0", color: "#004085" }}>💡 วิธีรวมกราฟ GitHub + GitLab:</h4>
              <p style={{ fontSize: "0.9rem", margin: 0, color: "#004085" }}>
                หากคุณต้องการรวมกราฟ ให้คุณ <strong>กดปุ่ม Connect ของอีกเจ้า</strong> ในขณะที่ยัง Login อยู่ครับ ระบบจะทำการเชื่อมบัญชีเข้าด้วยกันให้โดยอัตโนมัติ
              </p>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                <button onClick={() => signIn("github")} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>Link GitHub</button>
                <button onClick={() => signIn("gitlab")} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>Link GitLab</button>
              </div>
            </div>

            <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f6f8fa", borderRadius: "8px", border: "1px solid #ddd" }}>
              <h3 style={{ marginTop: 0 }}>Your Secure SVG URL:</h3>
              <code style={{ display: "block", wordBreak: "break-all", fontSize: "0.8rem", marginBottom: "1rem", padding: "1rem", backgroundColor: "#fff", border: "1px solid #eee" }}>
                {generatedUrl}
              </code>
              
              <h3 style={{ fontSize: "1rem" }}>Markdown:</h3>
              <code style={{ display: "block", wordBreak: "break-all", fontSize: "0.8rem", backgroundColor: "#333", color: "#fff", padding: "1rem", borderRadius: "4px" }}>
                {`![Unified Graph](${generatedUrl})`}
              </code>

              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ fontSize: "1rem" }}>Preview:</h3>
                {generatedUrl && (
                  <img 
                    src={`${generatedUrl}${generatedUrl.includes('?') ? '&' : '?'}t=${Date.now()}`} 
                    alt="Preview" 
                    style={{ maxWidth: "100%", border: "1px solid #eee", borderRadius: "4px" }} 
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
