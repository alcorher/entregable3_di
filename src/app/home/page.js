"use client";
import { useState, useEffect } from "react";
import RecetaCard from "../Receta.js";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecetas() {
      try {
        const res = await fetch("/api/recetas");
        if (res.ok) {
          const data = await res.json();
          setRecipes(data);
        } else {
          console.error("Error al cargar recetas del servidor");
        }
      } catch (error) {
        console.error("Error de conexión", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecetas();
  }, []);

  return (
    <main>
      <section className="relative w-full">
        <img
          src="/images/heroHome.png"
          className="w-full h-1/2 lg:h-96 object-cover"
          alt="Hero background"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/images/logo.png"
            className="w-1/2 lg:w-1/3 h-auto"
            alt="Logo"
          />
        </div>
      </section>

      <section>
        <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">
          Recetas recientes
        </h1>

        {loading ? (
          <p className="px-15 text-gray-500">Cargando recetas...</p>
        ) : recipes.length === 0 ? (
          <p className="px-15 text-gray-500">
            Aún no hay recetas publicadas. ¡Anímate a subir la primera!
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <RecetaCard recipe={recipe} />
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-center space-x-4 p-10 px-15">
          <button className="btn px-4 py-2 bg-brand-300 rounded hover:bg-brand-400">
            {" "}
            ← Anterior{" "}
          </button>
          <button className="btn px-4 py-2 bg-brand-300 rounded hover:bg-brand-400">
            {" "}
            Siguiente →{" "}
          </button>
        </div>
      </section>
    </main>
  );
}
