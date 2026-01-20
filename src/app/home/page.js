"use client";
import { listRecipes } from "../data.js";
import { useState } from "react";
import RecetaCard from "../Receta.js";
export default function Home() {
  //Muestra las 20 últimas recetas de la lista
  //Luego abriría una paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [listRecipesState, setListRecipesState] = useState(
    [...listRecipes].reverse().slice(-20 * currentPage),
  );

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
          <img src="/images/logo.png" className="w-1/2 lg:w-1/3 h-auto" alt="Logo" />
        </div>
      </section>

      <section>
        <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">Recetas recientes</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch ">
          {listRecipesState.map((recipe) => (
            <li key={recipe.id}>
              <RecetaCard recipe={recipe} />
            </li>
          ))}
        </ul>
        <div className="flex justify-center space-x-4 p-10 px-15">
          <button> ← </button>
          <button> → </button>
        </div>
      </section>
    </main>
  );
}
