import { useState } from "react";
import api from "./services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try{
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      console.log(res.data);
      window.location.href = "/dashboard";
    }catch(err){
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div>
      <input placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}