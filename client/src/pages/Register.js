import { useState } from "react";
import api from "./services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", form);
      alert("Usuario creado ✅");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Registro</h2>

      <input
        name="name"
        placeholder="Nombre"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button onClick={handleRegister}>
        Registrarse
      </button>
    </div>
  );
}