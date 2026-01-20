"use client";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validarFormulario = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    } else if (!username || !mail || !password || !confirmPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <img
        src="/images/formsBG.png"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />
      <div className="fixed inset-0 bg-black/50 -z-5"></div>

      <div className="w-full max-w-md">
        <img
          src="/images/logo.png"
          className="w-full h-auto mx-auto mb-8"
        />

        <div className="w-full max-w-md rounded-2xl shadow-2xl">
          <div className="bg-white rounded-2xl shadow-md">
            <div className="bg-brand-300 p-8 rounded-2xl shadow-md">
              <h1 className="text-3xl text-center text-brand-900 mb-8 font-primary font-normal">
                Registro
              </h1>

              <form onSubmit={validarFormulario} className="space-y-6">
              
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-brand-900 mb-2"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Introduce tu nombre"
                    className="w-full rounded-lg border bg-white border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                
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
                    className="w-full rounded-lg border bg-white border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                  />
                </div>

                
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
                    className="w-full bg-white rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-brand-900 mb-2"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className="w-full bg-white rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                  />
                </div>

                <a
                  className="text-sm text-start text-gray-900 block hover:underline mb-8"
                  href="/login"
                >
                  ¿Ya tienes cuenta?{" "}
                  <span className="inline text-brand-900 font-semibold hover:underline">
                    Inicia sesión
                  </span>
                </a>

                
                <button
                  type="submit"
                  className="
                    btn
                    w-full
                    shadow-lg shadow-zinc-600
                    transition-all duration-200 ease-out
                    hover:shadow-md hover:-translate-y-0.5
                    active:translate-y-0.5 active:shadow-md active:scale-99
                    focus:outline-none
                  "
                >
                  Registrarse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
