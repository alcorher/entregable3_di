'use client';
import { listRecipes } from "../data.js";
import { useState } from "react";
import RecetaCard from "../Receta";

export default function FavoritosPage() {
    const [recipes, setRecipes] = useState(listRecipes);

  return (
    <div>
      <h1>Favoritos</h1>
        <ul>
            {recipes.map((recipe) => (
                <li key={recipe.id}>
                    <RecetaCard recipe={recipe} />
                </li>
            ))}
        </ul>

    </div>
  );
}