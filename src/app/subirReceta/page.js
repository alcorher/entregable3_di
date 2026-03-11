"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubirReceta() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dificulty, setDificulty] = useState("Fácil");
  const [time, setTime] = useState("00:30");
  const [ingredientes, setIngredientes] = useState([""]);
  const [pasos, setPasos] = useState([""]);
  const [loading, setLoading] = useState(false);

  // Styles defined as constants
  const labelClass = "block text-xl font-bold text-brand-900 mb-2 font-primary";
  const inputClass =
    "w-full p-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors bg-white text-gray-700";

  const guardarReceta = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombre || !descripcion || !time) {
      alert(
        "Por favor, completa al menos el nombre, la descripción y el tiempo.",
      );
      return;
    }

    // Filtramos para quitar ingredientes o pasos vacíos que el usuario haya dejado en blanco
    const ingredientesValidos = ingredientes.filter((i) => i.trim() !== "");
    const pasosValidos = pasos.filter((p) => p.trim() !== "");

    setLoading(true);

    try {
      const res = await fetch("/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: nombre,
          descripcion: descripcion,
          dificultad: dificulty,
          tiempo: time,
          ingredientes: ingredientesValidos,
          pasos: pasosValidos,
        }),
      });

      if (res.ok) {
        alert("¡Receta publicada con éxito!");
        router.push("/home"); // Te redirige a la página principal
      } else {
        const errorData = await res.json();
        alert("Error al guardar: " + errorData.error);
      }
    } catch (error) {
      alert("Ocurrió un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 my-8">
      <h2 className="text-3xl font-primary font-bold text-brand-900 mb-8 pb-4">
        Subir Receta
      </h2>

      <form onSubmit={guardarReceta} className="flex flex-col gap-6">
        <div>
          <label className={labelClass}>
            Imagen de la receta (Próximamente)
          </label>
          <input
            type="file"
            disabled
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-500 cursor-not-allowed opacity-50"
          />
          <p className="text-sm text-gray-500 mt-1">
            La subida de imágenes se activará en la siguiente fase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Nombre del plato</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={inputClass}
              placeholder="Ej. Paella Valenciana"
              disabled={loading}
            />
          </div>
          <div>
            <label className={labelClass}>Tiempo de preparación</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción</label>
            <textarea
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className={inputClass}
              placeholder="Describe brevemente tu plato..."
              disabled={loading}
            ></textarea>
          </div>
          <div>
            <label className={labelClass}>Dificultad</label>
            <select
              value={dificulty}
              onChange={(e) => setDificulty(e.target.value)}
              className={`${inputClass} appearance-none`}
              disabled={loading}
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
              onClick={() => setIngredientes([...ingredientes, ""])}
              className="text-sm bg-brand-300 text-brand-900 px-3 cursor-pointer py-1 rounded-full font-semibold transition hover:bg-brand-400"
              disabled={loading}
            >
              Añadir ingrediente
            </button>
          </div>
          <div className="space-y-3">
            {ingredientes.map((ingrediente, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-gray-400 font-mono text-sm w-6 text-right">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={ingrediente}
                  onChange={(e) => {
                    const nuevosIngredientes = [...ingredientes];
                    nuevosIngredientes[index] = e.target.value;
                    setIngredientes(nuevosIngredientes);
                  }}
                  className={inputClass}
                  placeholder="Ej. 200g de arroz"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 px-2 font-bold"
                  onClick={() => {
                    const nuevos = ingredientes.filter((_, i) => i !== index);
                    setIngredientes(nuevos);
                  }}
                  disabled={loading}
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
              onClick={() => setPasos([...pasos, ""])}
              className="btn py-1 px-4 text-sm"
              disabled={loading}
            >
              Añadir paso
            </button>
          </div>
          <div className="space-y-4">
            {pasos.map((paso, index) => (
              <div key={index} className="flex gap-4 items-start">
                <span className="text-3xl font-bold text-brand-900 font-secondary mt-1">
                  {index + 1}º
                </span>
                <textarea
                  rows="2"
                  value={paso}
                  onChange={(e) => {
                    const nuevosPasos = [...pasos];
                    nuevosPasos[index] = e.target.value;
                    setPasos(nuevosPasos);
                  }}
                  className={inputClass}
                  placeholder={`Describe el paso ${index + 1}...`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 mt-3 font-bold"
                  onClick={() => {
                    const nuevos = pasos.filter((_, i) => i !== index);
                    setPasos(nuevos);
                  }}
                  disabled={loading}
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
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg text-gray-600 font-medium transition cursor-pointer hover:bg-gray-100"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-2 rounded-lg bg-brand-900 text-white font-medium shadow-md cursor-pointer transition ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-brand-800 hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Guardando..." : "Guardar Receta"}
          </button>
        </div>
      </form>
    </div>
  );
}
