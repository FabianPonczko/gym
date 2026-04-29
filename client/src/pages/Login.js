import {useEffect, useState } from "react";
import api from "./services/api";
import { getUserFromToken } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = async () => {
  //   try{
  //     const res = await api.post("/auth/login", { email, password });
  //     localStorage.setItem("token", res.data.token);
  //     console.log(res.data);
  //     window.location.href = "/dashboard";
  //   }catch(err){
  //     alert(err.response?.data || "Error");
  //   }
  // };

  // useEffect(() => {
  //   const user = getUserFromToken();

  //   if (user) {
  //     if (user.role === "admin") {
  //       window.location.href = "/admin";
  //     } else if (user.role === "coach") {
  //       window.location.href = "/coach";
  //     } else {
  //       window.location.href = "/dashboard";
  //     }
  //   }
  // }, []);

  const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password
    });

    localStorage.setItem("token", res.data.token);

    const user = getUserFromToken();

    if (user.role === "Admin") {
      window.location.href = "/Admin";
    } else if (user.role === "coach") {
      window.location.href = "/coach";
    } else {
      window.location.href = "/Dashboard";
    }

  } catch (err) {
    alert("Error login");
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