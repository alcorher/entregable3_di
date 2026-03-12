"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function RecetaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recetaId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [receta, setReceta] = useState(null);
  const [autor, setAutor] = useState(null);

  // Estados de permisos y favoritos
  const [ownRecipe, setOwnRecipe] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estados del formulario de edición
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDificulty, setEditDificulty] = useState("Fácil");
  const [editTime, setEditTime] = useState("");
  const [editIngredientes, setEditIngredientes] = useState([]);
  const [editPasos, setEditPasos] = useState([]);
  const [nuevaImagen, setNuevaImagen] = useState(null);

  // Clases CSS para el formulario de edición
  const labelClass = "block text-xl font-bold text-brand-900 mb-2 font-primary";
  const inputClass =
    "w-full p-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors bg-white text-gray-700";

  useEffect(() => {
    async function fetchData() {
      if (!recetaId) return setLoading(false);
      try {
        const res = await fetch(`/api/recetas/detalle?id=${recetaId}`);
        if (res.ok) {
          const data = await res.json();

          if (data && data.receta) {
            const ingParsed = data.receta.ingredientes
              ? JSON.parse(data.receta.ingredientes)
              : [];
            const pasParsed = data.receta.pasos
              ? JSON.parse(data.receta.pasos)
              : [];

            setReceta({
              ...data.receta,
              ingredientes: ingParsed,
              pasos: pasParsed,
            });
            setAutor(data.receta.perfiles);
            setOwnRecipe(data.isOwnRecipe);
            setAdmin(data.currentUserIsAdmin);

            // Sincronizar estados de edición
            setEditName(data.receta.titulo);
            setEditDescription(data.receta.descripcion);
            setEditDificulty(data.receta.dificultad);
            setEditTime(data.receta.tiempo);
            setEditIngredientes(ingParsed);
            setEditPasos(pasParsed);
          } else {
            console.error("La respuesta no contiene una receta válida");
            setReceta(null);
          }
        }
      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [recetaId]);

  const toggleFavorito = async () => {
    const method = isFavorite ? "DELETE" : "POST";
    const url = isFavorite ? `/api/favoritos?id=${recetaId}` : "/api/favoritos";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: isFavorite ? null : JSON.stringify({ recetaId }),
    });
    if (res.ok) setIsFavorite(!isFavorite);
  };

  const guardarCambios = async (e) => {
    e.preventDefault();

    // 1. Limpiamos los espacios en blanco de los campos principales
    const nombreLimpio = editName.trim();
    const descripcionLimpia = editDescription.trim();
    const timeLimpio = editTime.trim();

    // 2. Comprobamos que no se hayan quedado vacíos tras limpiar los espacios
    if (!nombreLimpio || !descripcionLimpia || !timeLimpio) {
      alert(
        "Por favor, completa el nombre, la descripción y el tiempo con texto válido (no solo espacios).",
      );
      return;
    }

    // 3. Filtramos los ingredientes y pasos que estén vacíos o sean solo espacios
    const ingredientesValidos = editIngredientes.filter((i) => i.trim() !== "");
    const pasosValidos = editPasos.filter((p) => p.trim() !== "");

    // 4. Validamos que haya al menos 1 ingrediente y 1 paso con contenido real
    if (ingredientesValidos.length === 0 || pasosValidos.length === 0) {
      alert("Por favor, añade al menos un ingrediente y un paso válido.");
      return;
    }

    setSaving(true);

    try {
      let final_imagen_url = receta.imagen_url;

      // LÓGICA DE SUBIDA DE LA NUEVA IMAGEN A SUPABASE
      if (nuevaImagen) {
        const supabase = createClient();
        const fileExt = nuevaImagen.name.split(".").pop();
        const fileName = `receta-edit-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("recetas")
          .upload(fileName, nuevaImagen);

        if (uploadError) {
          alert("Error al subir la nueva imagen: " + uploadError.message);
          setSaving(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("recetas")
          .getPublicUrl(fileName);

        final_imagen_url = publicUrlData.publicUrl;
      }

      const res = await fetch("/api/recetas/detalle", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: recetaId,
          titulo: nombreLimpio, // Usamos las variables limpias
          descripcion: descripcionLimpia,
          tiempo: timeLimpio,
          dificultad: editDificulty,
          ingredientes: ingredientesValidos, // Usamos los arrays filtrados
          pasos: pasosValidos,
          imagen_url: final_imagen_url,
        }),
      });

      if (res.ok) {
        setReceta({
          ...receta,
          titulo: nombreLimpio,
          descripcion: descripcionLimpia,
          tiempo: timeLimpio,
          dificultad: editDificulty,
          ingredientes: ingredientesValidos,
          pasos: pasosValidos,
          imagen_url: final_imagen_url,
        });

        // Sincronizamos los estados de edición con los valores limpios
        setEditName(nombreLimpio);
        setEditDescription(descripcionLimpia);
        setEditTime(timeLimpio);
        setEditIngredientes(ingredientesValidos);
        setEditPasos(pasosValidos);

        setIsEditing(false);
        setNuevaImagen(null);
        alert("Receta actualizada con éxito.");
      } else {
        const errorData = await res.json();
        alert("Hubo un error al guardar los cambios: " + errorData.error);
      }
    } catch (error) {
      alert("Ocurrió un error al conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  };

  const eliminarReceta = async () => {
    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar permanentemente esta receta?",
      )
    )
      return;
    const res = await fetch(
      `/api/recetas/detalle?id=${recetaId}&action=delete`,
      { method: "DELETE" },
    );
    if (res.ok) router.push("/home");
  };

  // NUEVA FUNCIÓN: Ocultar o mostrar receta (solo admin)
  const toggleOcultar = async () => {
    const nuevoEstado = !receta.oculta;
    const accion = nuevoEstado ? "ocultar" : "mostrar";

    if (
      !confirm(
        `¿Estás seguro de que quieres ${accion} esta receta para el resto de usuarios?`,
      )
    )
      return;

    const res = await fetch(`/api/recetas/detalle?id=${recetaId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oculta: nuevoEstado }),
    });

    if (res.ok) {
      setReceta({ ...receta, oculta: nuevoEstado });
      alert(`Receta ${nuevoEstado ? "ocultada" : "visible"} correctamente.`);
    } else {
      const errorData = await res.json();
      alert("Error: " + errorData.error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-xl text-brand-900 font-primary">
        Cargando receta...
      </div>
    );
  if (!receta)
    return (
      <div className="p-10 text-center text-red-600 font-bold text-xl">
        Receta no encontrada.
      </div>
    );

  return (
    <>
      {isEditing ? (
        // --- VISTA EDICIÓN (FORMULARIO COMPLETO) ---
        <div className="max-w-4xl mx-auto p-8 my-8">
          <h2 className="text-3xl font-primary font-bold text-brand-900 mb-8 pb-4">
            Editar Receta
          </h2>

          <form onSubmit={guardarCambios} className="flex flex-col gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Imagen de la receta</label>
              <div className="flex flex-col md:flex-row items-center gap-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="w-40 h-32 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                  {nuevaImagen ? (
                    <img
                      src={URL.createObjectURL(nuevaImagen)}
                      className="w-full h-full object-cover"
                      alt="Nueva"
                    />
                  ) : receta.imagen_url ? (
                    <img
                      src={receta.imagen_url}
                      className="w-full h-full object-cover"
                      alt="Actual"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNuevaImagen(e.target.files[0])}
                    disabled={saving}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-100 file:text-brand-900 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Selecciona una nueva imagen solo si deseas cambiar la
                    actual.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nombre del plato</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tiempo de preparación</label>
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Descripción</label>
                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={saving}
                  className={inputClass}
                ></textarea>
              </div>
              <div>
                <label className={labelClass}>Dificultad</label>
                <select
                  value={editDificulty}
                  onChange={(e) => setEditDificulty(e.target.value)}
                  disabled={saving}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Media">Media</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-bold text-brand-900 font-primary">
                  Ingredientes
                </label>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditIngredientes([...editIngredientes, ""])}
                  className="text-sm bg-brand-300 text-brand-900 px-3 cursor-pointer py-1 rounded-full font-semibold transition hover:bg-brand-400"
                >
                  Añadir ingrediente
                </button>
              </div>
              <div className="space-y-3">
                {editIngredientes.map((ingrediente, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-gray-400 font-mono text-sm w-6 text-right">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={ingrediente}
                      disabled={saving}
                      onChange={(e) => {
                        const nuevosIngredientes = [...editIngredientes];
                        nuevosIngredientes[index] = e.target.value;
                        setEditIngredientes(nuevosIngredientes);
                      }}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      disabled={saving}
                      className="text-red-400 hover:text-red-600 px-2 font-bold"
                      onClick={() => {
                        const nuevos = editIngredientes.filter(
                          (_, i) => i !== index,
                        );
                        setEditIngredientes(nuevos);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-300 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-bold text-brand-900 font-primary">
                  Pasos de preparación
                </label>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setEditPasos([...editPasos, ""])}
                  className="btn py-1 px-4 text-sm"
                >
                  Añadir paso
                </button>
              </div>
              <div className="space-y-4">
                {editPasos.map((paso, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <span className="text-3xl font-bold text-brand-900 font-secondary mt-1">
                      {index + 1}º
                    </span>
                    <textarea
                      rows="2"
                      value={paso}
                      disabled={saving}
                      onChange={(e) => {
                        const nuevosPasos = [...editPasos];
                        nuevosPasos[index] = e.target.value;
                        setEditPasos(nuevosPasos);
                      }}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      disabled={saving}
                      className="text-red-400 hover:text-red-600 mt-3 font-bold"
                      onClick={() => {
                        const nuevos = editPasos.filter((_, i) => i !== index);
                        setEditPasos(nuevos);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNuevaImagen(null);
                }}
                disabled={saving}
                className="px-6 py-2 rounded-lg text-gray-600 font-medium transition cursor-pointer hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-2 rounded-lg bg-brand-900 text-white font-medium shadow-md cursor-pointer transition ${saving ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-800"}`}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // --- VISTA DETALLE ---
        <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-6 w-full md:w-5/12">
            <div className="rounded-lg">
              <img
                className="w-full h-auto rounded-xl object-cover shadow-sm"
                src={receta.imagen_url || "/images/food/placeHolder.png"}
                alt={receta.titulo}
              />
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold font-primary text-brand-900 mb-4 w-fit pb-1">
                Ingredientes
              </h2>
              <ul className="space-y-3">
                {receta.ingredientes.map((ing, index) => (
                  <li
                    key={index}
                    className="text-brand-900 flex items-center gap-2"
                  >
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 mt-8 pt-4 text-sm">
              {ownRecipe && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn px-4 cursor-pointer"
                  >
                    Editar receta
                  </button>
                  <button
                    onClick={eliminarReceta}
                    className="px-4 rounded-full font-semibold py-2 text-xs bg-red-700 text-white shadow-md transition duration-300 cursor-pointer hover:bg-red-800"
                  >
                    Eliminar receta
                  </button>
                </>
              )}
              {/* Modificado: Botón dinámico Ocultar/Mostrar para admins */}
              {admin && !ownRecipe && (
                <button
                  onClick={toggleOcultar}
                  className={`px-4 rounded-full font-semibold py-2 text-white shadow-md transition duration-300 cursor-pointer text-xs ${
                    receta.oculta
                      ? "bg-green-700 hover:bg-green-800"
                      : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  {receta.oculta ? "Mostrar receta" : "Ocultar receta"}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full md:w-7/12 relative text-brand-900">
            <div className="flex justify-between items-start mb-2 gap-4">
              <h1 className="text-5xl font-primary font-bold leading-tight text-brand-900">
                {receta.titulo}
              </h1>
              <button
                onClick={toggleFavorito}
                className={`${isFavorite ? "bg-red-600 hover:bg-red-700" : "bg-brand-900 hover:bg-green-800"} text-white text-xs font-semibold py-2 px-5 rounded-full shadow-md transition-all shrink-0 mt-2 cursor-pointer`}
              >
                {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              </button>
            </div>

            <div
              className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition"
              onClick={() =>
                router.push(`/perfilUsuario?userId=${receta.autor_id}`)
              }
            >
              <img
                src={
                  autor?.avatar_url ||
                  "https://imgs.search.brave.com/gFkNOZO5nDNB1qgQXJhuQv8LISNnf6cFG3Si0sWA_kg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzEv/NjA2LzQ4NS9zbWFs/bC9jaGVmLWF2YXRh/ci1pbHVzdHJhdGlv/bi1mcmVlLXZlY3Rv/ci5qcGc"
                }
                alt={autor?.nombre}
                className="h-10 w-10 object-cover rounded-full"
              />
              <span className="font-bold text-sm hover:underline">
                {autor?.nombre}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-lg text-gray-700">{receta.descripcion}</p>
            </div>

            <div className="flex gap-16 mb-10 pb-6 border-b border-gray-100">
              <div className="flex flex-col items-center">
                <h3 className="font-bold font-secondary text-lg mb-1">
                  Dificultad
                </h3>
                <span className="font-medium text-brand-900">
                  {receta.dificultad}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="font-bold font-secondary text-lg mb-1">
                  Tiempo
                </h3>
                <p className="font-medium text-brand-900">{receta.tiempo}</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {receta.pasos.map((paso, index) => (
                <div
                  key={index}
                  className="bg-brand-300 rounded-2xl p-6 flex gap-6 items-start shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-5xl font-bold font-secondary text-brand-900 leading-none">
                    {index + 1}º
                  </span>
                  <p className="leading-relaxed text-brand-900 pt-2 text-lg">
                    {paso}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-bold text-xl text-brand-900">
          Cargando receta...
        </div>
      }
    >
      <RecetaContent />
    </Suspense>
  );
}
