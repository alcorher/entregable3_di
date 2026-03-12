"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Componente Usuario (Tarjeta) con tu diseño exacto y enlace al perfil
function Usuario({ user }) {
  return (
    <a
      href={`/perfilUsuario?userId=${user.id}`}
      className="block h-full group cursor-pointer"
    >
      <div
        className="
          flex flex-col
          rounded-lg
          bg-brand-300
          text-brand-900
          shadow-lg
          shadow-brand-300
          hover:-translate-y-2
          hover:shadow-xl
          transition
          duration-300
          ease-in-out
          h-full
        "
      >
        <img
          className="w-full h-30 md:h-50 object-cover rounded-t-lg"
          src={
            user.avatar_url ||
            "https://imgs.search.brave.com/gFkNOZO5nDNB1qgQXJhuQv8LISNnf6cFG3Si0sWA_kg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzEv/NjA2LzQ4NS9zbWFs/bC9jaGVmLWF2YXRh/ci1pbHVzdHJhdGlv/bi1mcmVlLXZlY3Rv/ci5qcGc"
          } // Adaptado a tu BD
          alt={user.nombre} // Adaptado a tu BD
          width="100"
        />
        <div className="px-4 py-2 gap-4 flex flex-col">
          <h2 className="font-primary font-bold text-2xl mt-2">
            {user.nombre}
          </h2>
          {/* Mantenemos el corte de texto que querías */}
          <p className="line-clamp-2">
            {user.sobre_mi || "Este usuario aún no ha escrito nada sobre sí."}
          </p>
        </div>
      </div>
    </a>
  );
}

// Componente que maneja la búsqueda de usuarios a la API
function BusquedaUsuariosContent() {
  const searchParams = useSearchParams();
  const busqueda = searchParams.get("busqueda") || "";

  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      try {
        const endpoint = busqueda
          ? `/api/usuarios?busqueda=${encodeURIComponent(busqueda)}`
          : "/api/usuarios";

        const res = await fetch(endpoint);

        if (res.ok) {
          const data = await res.json();
          setListaUsuarios(data || []);
        }
      } catch (error) {
        console.error("Error al buscar usuarios:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuarios();
  }, [busqueda]);

  if (loading) {
    return (
      <div className="p-10 text-center text-xl font-bold text-brand-900 font-primary">
        Buscando usuarios...
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">
        Búsqueda: {busqueda || "Todos"}
      </h1>

      {listaUsuarios.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch">
          {listaUsuarios.map((usuario) => (
            <li key={usuario.id}>
              <Usuario user={usuario} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-15 py-10">
          <p className="text-xl text-brand-900 font-medium text-center bg-gray-100 p-8 rounded-xl shadow-inner">
            No se han encontrado usuarios que coincidan con "{busqueda}".
          </p>
        </div>
      )}
    </div>
  );
}

// Wrapper con Suspense necesario en Next.js App Router para usar useSearchParams
export default function UsuariosSearch() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Cargando la página...</div>}
    >
      <BusquedaUsuariosContent />
    </Suspense>
  );
}
