import { useState } from "react";

export default function AdminTest() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user, pass })
    });

    const data = await res.json();
    setMsg(data.ok ? "LOGIN SUCCESS" : "WRONG CREDENTIALS");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Login Test</h2>

      <input placeholder="username" onChange={e => setUser(e.target.value)} />
      <br/><br/>

      <input placeholder="password" onChange={e => setPass(e.target.value)} />
      <br/><br/>

      <button onClick={login}>Login</button>

      <h3>{msg}</h3>
    </div>
  );
}

