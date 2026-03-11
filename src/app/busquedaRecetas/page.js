"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RecetaCard from "../Receta";

function BusquedaContent() {
  const searchParams = useSearchParams();
  const busqueda = searchParams.get("busqueda") || "";
  
  const [listaRecetas, setListaRecetas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecetas() {
      setLoading(true);
      try {
        // Hacemos el GET a nuestra propia API
        const endpoint = busqueda 
          ? `/api/recetas?busqueda=${encodeURIComponent(busqueda)}` 
          : "/api/recetas";
          
        const res = await fetch(endpoint);
        
        if (res.ok) {
          const data = await res.json();
          setListaRecetas(data || []);
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
  }, [busqueda]); // Se vuelve a ejecutar si cambia la búsqueda en la URL

  if (loading) {
    return <div className="p-10 text-center text-xl font-bold text-brand-900">Buscando recetas...</div>;
  }

  return (
    <div>
      <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">
        Búsqueda: {busqueda ? busqueda : "Últimas recetas"}
      </h1>
      
      {listaRecetas.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch mb-10">
          {listaRecetas.map((receta) => (
            <li key={receta.id}>
              <RecetaCard recipe={receta} />
            </li>
          ))}
        </ul>
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

// Envolvemos el componente principal en Suspense (necesario en Next.js al usar useSearchParams)
export default function RecetaSearch() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando la página...</div>}>
      <BusquedaContent />
    </Suspense>
  );
}