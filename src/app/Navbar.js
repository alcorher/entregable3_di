"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
  const location = usePathname();
  const [open, setOpen] = useState(false);

  if (
    location === "/inicioSesion" ||
    location === "/registro" ||
    location === "/"
  ) {
    return null;
  }

  return (
    <nav className="bg-brand-900 text-white px-5 py-3">
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        {/* Logo */}
        <a href="/">
          <img src="/images/logo.png" className="h-10 w-auto ps-2" />
        </a>

        {/* Desktop Search */}
        <form className="hidden md:flex bg-white rounded-full items-center border-2 border-brand-600">
          <select
            className="mx-3 bg-white text-brand-900 p-1.5 rounded-s-full focus:outline-none appearance-none"
            name="searchOption"
            defaultValue="Recetas"
          >
            <option value="Recetas">Recetas</option>
            <option value="Usuarios">Usuarios</option>
          </select>

          <input
            type="text"
            placeholder="Buscar"
            className="bg-white text-brand-900 p-1.5 focus:outline-none border-s-2 border-brand-600"
          />

          <button type="submit" className="text-brand-900 p-1.5 px-4">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
        </form>

        {/* Desktop Icons */}
        <div className="hidden md:flex gap-6 items-center pe-2">
          <a href="/nuevaReceta">
            <svg width="25" height="25" fill="currentColor" className="h-8 w-auto" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
            </svg>
          </a>

          <a href="/favoritos">
            <svg width="25" height="25" fill="currentColor" className="h-8 w-auto" viewBox="0 0 16 16">
              <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
            </svg>
          </a>

          <a href="/perfilUsuario">
            <img
              src="https://imgs.search.brave.com/CM9dCKfA9Wa0sdTIxbTCkj-hrAk1Uoa6d8pvYzsJtHk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjM1/MjQ2MTgwL2VzL2Zv/dG8vbWFkcmlkLXNw/YWluLXNwYW5pc2gt/Y2hlZi1hbGJlcnRv/LWNoaWNvdGUtcHJl/c2VudHMtdGhlLXRv/cC1jaGVmLXR2LXNo/b3ctYXQta2l0Y2hl/bi1jbHViLW9uLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1t/d1BTYTgwYUhaeHRV/aHZraVBIU0dUSzJ2/LThQOE56ZUZFNjUt/M1hSUDY4PQ"
              alt="Perfil"
              className="rounded-full h-10 w-10 object-cover"
            />
          </a>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {/* Mobile Search */}
          <form className="bg-white rounded-full flex items-center border-2 border-brand-600">
            <select
              className="mx-3 bg-white text-brand-900 p-1.5 rounded-s-full focus:outline-none appearance-none"
              defaultValue="Recetas"
            >
              <option value="Recetas">Recetas</option>
              <option value="Usuarios">Usuarios</option>
            </select>

            <input
              type="text"
              placeholder="Buscar"
              className="bg-white text-brand-900 p-1.5 focus:outline-none border-s-2 border-brand-600 w-full"
            />

            <button type="submit" className="text-brand-900 p-1.5 px-4">
             <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            </button>
          </form>

          {/* Mobile Links */}
          <a href="/nuevaReceta" className="py-2 border-b border-white/20">Nueva Receta</a>
          <a href="/favoritos" className="py-2 border-b border-white/20">Favoritos</a>
          <a href="/perfilUsuario" className="py-2">Perfil</a>
        </div>
      )}
    </nav>
  );
}
