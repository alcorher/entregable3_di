'use client';
import { listRecipes } from "../data.js";
import { useState } from "react";
import RecetaCard from "../Receta.js";

const user = "Chicote";

export default function FavoritosPage() {
    const [recipes, setRecipes] = useState(listRecipes);
    const [username, setUsername] = useState(user);
  return (
    <div>
      <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">Lista recetas de {username}</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch ">
            {recipes.map((recipe) => (
                <li key={recipe.id}>
                    <RecetaCard recipe={recipe} />
                </li>
            ))}
        </ul>

    </div>
  );
}