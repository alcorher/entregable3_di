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
      <h1>Lista recetas de {username}</h1>
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