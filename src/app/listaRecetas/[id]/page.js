'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import RecetaCard from "../../Receta"; 

export default function ListaRecetasPage() {
  const params = useParams();
  const userId = params.id; 

  const [recipes, setRecipes] = useState([]);
  const [username, setUsername] = useState("Cargando...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecetasDelUsuario() {
      if (!userId) {
        setUsername("Usuario no especificado");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/recetas/usuario/${userId}`);
        
        if (res.ok) {
          const data = await res.json();
          setRecipes(data.recetas);
          setUsername(data.username);
        } else {
          setUsername("Usuario no encontrado");
        }
      } catch (error) {
        console.error("Error de conexión", error);
        setUsername("Error al cargar");
      } finally {
        setLoading(false);
      }
    }

    fetchRecetasDelUsuario();
  }, [userId]);

  return (
    <div className="min-h-screen pb-10">
      <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">
        Lista recetas de {username}
      </h1>
      
      {loading ? (
        <p className="px-15 text-gray-500">Cargando las recetas de {username}...</p>
      ) : recipes.length === 0 ? (
        <p className="px-15 text-gray-500">Este usuario todavía no ha subido ninguna receta.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <RecetaCard recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}