"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function NavBar() {
  const location = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState("/images/gertru.png");

  useEffect(() => {
    async function fetchUserAvatar() {
      try {
        const res = await fetch("/api/perfil");
        if (res.ok) {
          const data = await res.json();
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error al cargar el avatar del navbar", error);
      }
    }

    if (
      location !== "/inicioSesion" &&
      location !== "/registro" &&
      location !== "/"
    ) {
      fetchUserAvatar();
    }
  }, [location]);

  if (
    location === "/inicioSesion" ||
    location === "/registro" ||
    location === "/"
  ) {
    return null;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/inicioSesion");
    router.refresh();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchOption = formData.get("searchOption");
    const searchQuery = formData.get("searchQuery");

    if (searchQuery && searchQuery.trim() !== "") {
      const queryStr = encodeURIComponent(searchQuery.trim());

      if (searchOption === "Recetas") {
        router.push(`/busquedaRecetas?busqueda=${queryStr}`);
      } else {
        router.push(`/busquedaUsuarios?busqueda=${queryStr}`);
      }

      setOpen(false);
    }
  };

  return (
    <nav className="bg-brand-900 text-white px-5 py-3">
      {/* Modificado: Contenedor dividido en 3 columnas flex para un centrado perfecto */}
      <div className="flex items-center justify-between w-full">
        {/* 1. IZQUIERDA: Logo (Ocupa su espacio proporcional) */}
        <div className="flex-1">
          <a href="/home">
            <img
              src="/images/logo.png"
              className="h-10 w-auto ps-2"
              alt="Logo"
            />
          </a>
        </div>

        {/* 2. CENTRO: Buscador (Se mantiene en el centro absoluto) */}
        <div className="hidden md:flex justify-center shrink-0">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-full flex items-center border-2 border-brand-600"
          >
            <select
              className="mx-3 bg-white text-brand-900 p-1.5 rounded-s-full focus:outline-none appearance-none cursor-pointer"
              name="searchOption"
              defaultValue="Recetas"
            >
              <option value="Recetas">Recetas</option>
              <option value="Usuarios">Usuarios</option>
            </select>

            <input
              type="text"
              name="searchQuery"
              placeholder="Buscar"
              className="bg-white text-brand-900 p-1.5 focus:outline-none border-s-2 border-brand-600"
            />

            <button
              type="submit"
              className="text-brand-900 p-1.5 px-4 cursor-pointer hover:bg-gray-100 rounded-e-full transition"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </form>
        </div>

        {/* 3. DERECHA: Iconos (Empujados a la derecha proporcionalmente) */}
        <div className="hidden md:flex flex-1 justify-end gap-6 items-center pe-2">
          <a href="/subirReceta">
            <svg
              width="25"
              height="25"
              fill="currentColor"
              className="h-8 w-auto hover:text-gray-300 transition"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
            </svg>
          </a>

          <a href="/favoritos">
            <svg
              width="25"
              height="25"
              fill="currentColor"
              className="h-8 w-auto hover:text-gray-300 transition"
              viewBox="0 0 16 16"
            >
              <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
            </svg>
          </a>

          <a href="/perfilUsuario">
            <img
              src={avatarUrl}
              alt="Perfil"
              className="rounded-full h-10 w-10 object-cover border-2 border-transparent hover:border-white transition"
            />
          </a>

          {/* Icono de salir: Tamaño arreglado a 25x25 y clase h-8 */}
          <button
            onClick={handleSignOut}
            className="hover:text-red-400 transition cursor-pointer flex items-center text white"
            title="Cerrar sesión"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-auto"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M18 8L22 12M22 12L18 16M22 12H9M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
        </div>

        {/* 3. DERECHA MÓVIL: Botón Hamburguesa */}
        <div className="md:hidden flex-1 flex justify-end">
          <button
            className="flex flex-col gap-1 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-full flex items-center border-2 border-brand-600"
          >
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
              name="searchQuery"
              placeholder="Buscar"
              className="bg-white text-brand-900 p-1.5 focus:outline-none border-s-2 border-brand-600 w-full"
            />

            <button
              type="submit"
              className="text-brand-900 p-1.5 px-4 cursor-pointer hover:bg-gray-100 rounded-e-full"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </form>

          <a href="/subirReceta" className="py-2 border-b border-white/20">
            Nueva Receta
          </a>
          <a href="/favoritos" className="py-2 border-b border-white/20">
            Favoritos
          </a>
          <a
            href="/perfilUsuario"
            className="py-2 flex items-center gap-2 border-b border-white/20"
          >
            <img
              src={avatarUrl}
              alt="Perfil"
              className="h-6 w-6 rounded-full object-cover"
            />
            Perfil
          </a>

          <button
            onClick={handleSignOut}
            className="py-2 text-left text-red-400 font-bold hover:text-red-300 transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
