"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RecetaCard from "../Receta";

function BusquedaContent() {
  const searchParams = useSearchParams();
  const busqueda = searchParams.get("busqueda") || "";
  
  const [listaRecetas, setListaRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para la paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; 


  useEffect(() => {
    setPage(1);
  }, [busqueda]);

  useEffect(() => {
    async function fetchRecetas() {
      setLoading(true);
      try {
        // Hacemos el GET a nuestra propia API incluyendo page y limit
        const endpoint = busqueda 
          ? `/api/recetas?busqueda=${encodeURIComponent(busqueda)}&page=${page}&limit=${limit}` 
          : `/api/recetas?page=${page}&limit=${limit}`;
          
        const res = await fetch(endpoint);
        
        if (res.ok) {
          const result = await res.json();
          // CORRECCIÓN: Ahora extraemos la propiedad 'data' y 'totalPages' del resultado
          setListaRecetas(result.data || []);
          setTotalPages(result.totalPages || 1);
        } else {
          console.error("Error al obtener las recetas de la API");
        }
      } catch (error) {
        console.error("Error de red al buscar recetas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecetas();
  }, [busqueda, page]); // Se vuelve a ejecutar si cambia la búsqueda o la página

  if (loading && listaRecetas.length === 0) {
    return <div className="p-10 text-center text-xl font-bold text-brand-900">Buscando recetas...</div>;
  }

  return (
    <div>
      <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">
        Búsqueda: {busqueda ? busqueda : "Últimas recetas"}
      </h1>
      
      {listaRecetas.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch mb-10">
            {listaRecetas.map((receta) => (
              <li key={receta.id}>
                <RecetaCard recipe={receta} />
              </li>
            ))}
          </ul>

          {/* Controles de Paginación para la búsqueda */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-6 p-10 px-15 mb-10">
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
        </>
      ) : (
        <div className="px-15 py-10">
          <p className="text-xl text-brand-900 font-medium text-center bg-gray-100 p-8 rounded-xl shadow-inner">
            No se han encontrado recetas para "{busqueda}".
          </p>
        </div>
      )}
    </div>
  );
}

// Envolvemos el componente principal en Suspense
export default function RecetaSearch() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando la página...</div>}>
      <BusquedaContent />
    </Suspense>
  );
}