'use client';
import { useState, useEffect } from "react";
import RecetaCard from "../Receta";

export default function FavoritosPage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFavoritos() {
            try {
                const res = await fetch("/api/favoritos");
                if (res.ok) {
                    const data = await res.json();
                    setRecipes(data);
                }
            } catch (error) {
                console.error("Error cargando favoritos:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFavoritos();
    }, []);

    return (
        <div className="min-h-screen">
            <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">Mis Favoritos</h1>
            
            {loading ? (
                <p className="px-15 text-gray-500">Cargando tus recetas guardadas...</p>
            ) : recipes.length === 0 ? (
                <div className="px-15">
                    <p className="text-gray-500 mb-4">Aún no tienes recetas favoritas.</p>
                    <a href="/home" className="text-brand-900 font-bold hover:underline">Explorar recetas</a>
                </div>
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