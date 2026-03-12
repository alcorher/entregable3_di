"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function PerfilContent() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");

  const [user, setUser] = useState({
    id: "",
    nombre: "",
    sobre_mi: "",
    avatar_url: "",
    bloqueado: false,
  });
  const [ownUser, setOwnUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [avatar, setAvatar] = useState(null); 

  const labelClass = "block text-sm font-bold text-brand-900 mb-2 font-primary";
  const inputClass =
    "w-full p-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors bg-white text-gray-700";

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const endpoint = userIdFromUrl
          ? `/api/perfil?userId=${userIdFromUrl}`
          : "/api/perfil";
        const res = await fetch(endpoint);

        if (res.ok) {
          const data = await res.json();
          setUser({
            id: data.id,
            nombre: data.nombre,
            sobre_mi:
              data.sobre_mi || "Este usuario aún no ha escrito nada sobre sí.",
            avatar_url:
              data.avatar_url ||
              "https://imgs.search.brave.com/gFkNOZO5nDNB1qgQXJhuQv8LISNnf6cFG3Si0sWA_kg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzEv/NjA2LzQ4NS9zbWFs/bC9jaGVmLWF2YXRh/ci1pbHVzdHJhdGlv/bi1mcmVlLXZlY3Rv/ci5qcGc",
            bloqueado: data.bloqueado,
          });
          setOwnUser(data.isOwnProfile);
          setAdmin(data.currentUserIsAdmin);
          setEditName(data.nombre);
          setEditAbout(data.sobre_mi || "");
        } else {
          if (!userIdFromUrl) window.location.href = "/inicioSesion";
        }
      } catch (error) {
        console.error("Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    }
    fetchPerfil();
  }, [userIdFromUrl]);

  const guardarCambios = async (e) => {
    e.preventDefault();

    // 1. Limpiamos los espacios en blanco al principio y al final
    const nombreLimpio = editName.trim();
    const sobreMiLimpio = editAbout.trim();

    // 2. Validación del nombre: si al quitar espacios se queda vacío, mostramos error y detenemos
    if (!nombreLimpio) {
      alert("El nombre no puede estar en blanco ni contener solo espacios.");
      return; // Muy importante el return para que no siga ejecutando
    }

    // 3. Validación de "Sobre mí": si está vacío, enviamos null
    const final_sobre_mi = sobreMiLimpio === "" ? null : sobreMiLimpio;

    let final_avatar_url = user.avatar_url; // Mantenemos el actual por si no se modifica

    // LÓGICA DE SUBIDA DE AVATAR A SUPABASE
    if (avatar) {
      const supabase = createClient();
      const fileExt = avatar.name.split(".").pop();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar, { upsert: true });

      if (uploadError) {
        alert("Error al subir el avatar: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      final_avatar_url = publicUrlData.publicUrl;
    }

    const res = await fetch("/api/perfil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombreLimpio, // Pasamos el nombre limpio
        sobre_mi: final_sobre_mi, // Pasamos null o el texto limpio
        avatar_url: final_avatar_url,
      }),
    });

    if (res.ok) {
      setUser({
        ...user,
        nombre: nombreLimpio,
        // Si final_sobre_mi es null, volvemos a poner tu texto por defecto en la UI
        sobre_mi: final_sobre_mi || "Este usuario aún no ha escrito nada sobre sí.",
        avatar_url: final_avatar_url,
      });
      // Actualizamos también los estados de edición para que no queden con espacios si vuelves a editar
      setEditName(nombreLimpio);
      setEditAbout(final_sobre_mi || "");
      
      setIsEditing(false);
      setAvatar(null); // Limpiamos el input file al guardar
    } else {
      // 1. Intentamos leer la respuesta del backend
      try {
        const errorData = await res.json();

        // 2. Mostramos el error del servidor (dependiendo de cómo lo llames en tu API: .error, .message, etc.)
        alert(
          errorData.error ||
            errorData.message ||
            "Error al guardar los cambios.",
        );
      } catch (e) {
        // Si la respuesta no es un JSON (por ejemplo, un error 500 del servidor de Vercel/Node)
        alert("Ocurrió un error inesperado en el servidor.");
      }
    }
  };

  const banearUsuario = async () => {
    const accion = user.bloqueado ? "desbloquear" : "bloquear";
    const confirmacion = confirm(
      `¿Estás seguro de que quieres ${accion} a este usuario?`,
    );

    if (!confirmacion) return;

    const res = await fetch("/api/perfil/bloquear", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetUserId: user.id,
        bloqueado: !user.bloqueado,
      }),
    });

    if (res.ok) {
      setUser({ ...user, bloqueado: !user.bloqueado });
      alert(
        `Usuario ${!user.bloqueado ? "bloqueado" : "desbloqueado"} correctamente.`,
      );
    } else {
      const errorData = await res.json();
      alert("Error: " + errorData.error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-xl font-bold text-brand-900">
        Cargando perfil...
      </div>
    );

  return (
    <div className="md:max-w-5/6 mx-auto p-6">
      {user.bloqueado && (
        <div className="bg-red-100 text-red-700 border border-red-200 p-4 rounded-xl text-center font-bold mb-6 shadow-sm">
          Este usuario está actualmente bloqueado.
        </div>
      )}

      {isEditing ? (
        <div className="md:shadow-lg md:rounded-2xl p-8 my-8">
          <h2 className="text-3xl font-primary font-bold text-brand-900 mb-8 pb-4">
            Editar Perfil
          </h2>

          <form onSubmit={guardarCambios} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <label className={labelClass}>Foto de perfil</label>
                <div className="flex flex-col items-center gap-4 p-4 rounded-xl ">
                  <div className="w-20 h-20 rounded-full overflow-hidden ">
                    <img
                      src={
                        avatar ? URL.createObjectURL(avatar) : user.avatar_url
                      }
                      alt="Foto de perfil actual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="block w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-100 file:text-brand-900 cursor-pointer"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-6">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Sobre mí</label>
                  <textarea
                    rows="5"
                    value={editAbout}
                    onChange={(e) => setEditAbout(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100 justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setAvatar(null);
                }}
                className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-2 rounded-lg bg-brand-900 text-white font-medium shadow-md cursor-pointer"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <img
            className="w-auto h-64 md:w-auto md:h-80 object-cover mx-auto mt-10 rounded-2xl shadow-md"
            src={user.avatar_url}
            alt={user.nombre}
          />

          <h1 className="font-primary font-bold text-5xl text-brand-900 p-10 px-15 text-center">
            {user.nombre}
          </h1>

          <div className="mx-auto md:w-5/6 px-15">
            <h2 className="font-primary font-semibold text-3xl text-brand-900 mb-10">
              Sobre mí
            </h2>

            <p className="text-brand-900">{user.sobre_mi}</p>

            <div className="flex flex-col md:flex-row gap-6 my-10 justify-center mx-auto">
              {/* 1. Lista de recetas: Ahora el <a> es el botón directamente */}
              <a
                href={`/listaRecetas?userId=${user.id}`}
                className="btn w-full md:w-1/2 py-3 flex items-center justify-center text-center"
              >
                Lista de recetas
              </a>

              {/* 2. Editar Perfil */}
              {ownUser && (
                <button
                  className="btn w-full md:w-1/2 py-3 flex items-center justify-center"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </button>
              )}

              {/* 3. Banear / Desbloquear Usuario */}
              {admin && !ownUser && (
                <button
                  onClick={banearUsuario}
                  className={`rounded-full font-semibold text-sm text-white shadow-md transition duration-300 w-full md:w-1/2 py-3 flex items-center justify-center ${
                    user.bloqueado
                      ? "bg-gray-600 hover:bg-gray-700"
                      : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  {user.bloqueado ? "Desbloquear usuario" : "Banear usuario"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Cargando la página...</div>}
    >
      <PerfilContent />
    </Suspense>
  );
}
