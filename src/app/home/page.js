"use client";
import { listRecipes } from "../data.js";
import { useState } from "react";
import RecetaCard from "../Receta.js";
export default function Home() {
  //Muestra las 20 últimas recetas de la lista
  //Luego abriría una paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [listRecipesState, setListRecipesState] = useState(
    [...listRecipes].reverse().slice(-20 * currentPage)
  );

  return (
    <main>
      <section>
        <img src="/images/heroHome.png" width="100%" />
        <img src="/images/logo.png" width="30%" />
      </section>
      <section>
        <h1>Recetas recientes</h1>
        <ul>
          {listRecipesState.map((recipe) => (
            <li key={recipe.id}>
              <RecetaCard recipe={recipe} />
            </li>
          ))}
        </ul>
        <div>
          <button> ← </button>
          <button> → </button>
        </div>
      </section>
    </main>
  );
}
