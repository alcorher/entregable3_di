"use client";
import { useState } from "react";
import { listUsers } from "../data";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const validarFormulario = (e) => {
    e.preventDefault();
    if (!mail || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const user = listUsers.find(
      (user) => user.mail === mail && user.password === password,
    );
    if (!user) {
      alert("Correo electrónico o contraseña incorrectos.");
      return;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background */}
      <img
        src="/images/formsBG.png"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />
      <div className="fixed inset-0 bg-black/50 -z-5"></div>

      {/* Card */}
      <div className="w-full max-w-md  rounded-2xl shadow-2xl ">
        {/* Logo */}
        <img src="/images/logo.png" className="h-20 mx-auto m-8" />

        <div className="bg-white p-8 rounded-b-2xl shadow-md">
          <h1 className="text-3xl font-bold text-center text-brand-900 mb-8">
            Inicio de sesión
          </h1>

          <form onSubmit={validarFormulario} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="mail"
                className="block text-sm font-semibold text-brand-900 mb-2"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                id="mail"
                placeholder="Introduce tu correo"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-brand-900 mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Register */}
            <p className="text-sm text-center text-gray-600">
              ¿No tienes cuenta?{" "}
              <a
                href="/register"
                className="text-brand-600 font-semibold hover:underline"
              >
                Regístrate
              </a>
            </p>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
