"use client";
import { useState, useEffect } from "react";
import RecetaCard from "../Receta.js";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 16; 

  useEffect(() => {
    async function fetchRecetas() {
      setLoading(true);
      try {
        const res = await fetch(`/api/recetas?page=${page}&limit=${limit}`);
        if (res.ok) {
          const result = await res.json();
          setRecipes(result.data || []);
          setTotalPages(result.totalPages || 1);
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
  }, [page]);

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

        
        {recipes.length > 0 && (
          <div className="flex justify-center items-center space-x-6 p-10 px-15">
            <button 
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`btn px-6 py-2 rounded-full font-bold transition ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-brand-300 hover:bg-brand-400 text-brand-900 cursor-pointer'}`}>
              ← Anterior
            </button>
            
            <span className="text-brand-900 font-semibold text-lg">
              Página {page} de {totalPages}
            </span>
            
            <button 
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className={`btn px-6 py-2 rounded-full font-bold transition ${page >= totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-brand-300 hover:bg-brand-400 text-brand-900 cursor-pointer'}`}>
              Siguiente →
            </button>
          </div>
        )}
      </section>
    </main>
  );
}