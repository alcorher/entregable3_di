"use client";
import { listUsers } from "../data";
import { useState } from "react";

const dueñoReceta = listUsers[0];

const recipe = [
  {
    id: 1,
    name: "Patatas fritas",
    description: "Crispy fried potatoes",
    dificulty: "Fácil",
    time: "30 minutos",
    image: "/images/food/papasAlAjillo.png", 
    ingredientes: ["4 papas grandes", "1L aceite de girasol", "Sal al gusto"],
    pasos: [
      "Pela las patatas y córtalas en rodajas finas o en tiras, según tu preferencia.",
      "Calienta el aceite de girasol en una sartén profunda o freidora a 180°C.",
      "Fríe las patatas en tandas para evitar que se peguen, hasta que estén doradas y crujientes.",
      "Retira las patatas con una espumadera y colócalas sobre papel absorbente para eliminar el exceso de aceite.",
      "Añade sal al gusto mientras aún están calientes y mezcla bien.",
      "Sirve las patatas fritas como acompañamiento o con tu salsa favorita.",
    ],
  },
];

export default function Receta() {
  const [ownRecipe, setOwnRecipe] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editName, setEditName] = useState(recipe[0].name);
  const [editDescription, setEditDescription] = useState(recipe[0].description);
  const [editDificulty, setEditDificulty] = useState(recipe[0].dificulty);
  const [editTime, setEditTime] = useState(recipe[0].time);
  const [editIngredientes, setEditIngredientes] = useState(recipe[0].ingredientes);
  const [editPasos, setEditPasos] = useState(recipe[0].pasos);
  
  const receta = recipe[0];
  const autorReceta = dueñoReceta;

  function editarReceta() {
    receta.name = editName;
    receta.description = editDescription;
    receta.dificulty = editDificulty;
    receta.time = editTime;
    receta.ingredientes = editIngredientes;
    receta.pasos = editPasos;
  }

  const labelClass = "block text-xl font-bold text-brand-900 mb-2 font-primary";
  const inputClass = "w-full p-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors bg-white text-gray-700";

  return (
    <>
      <div>
        <button onClick={() => setOwnRecipe(!ownRecipe)} disabled={admin} >
          {ownRecipe ? "Ver como otro usuario" : "Ver como dueño de la receta"}
        </button>
        <button onClick={() => setAdmin(!admin)} disabled={ownRecipe} >
          {admin ? "Desactivar modo admin" : "Activar modo admin"}
        </button>
      </div>

      {isEditing ? (
        <div className="max-w-4xl mx-auto p-8 my-8">
          <h2 className="text-3xl font-primary font-bold text-brand-900 mb-8 pb-4">
            Editar Receta
          </h2>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editarReceta();
              setIsEditing(false);
            }}
            className="flex flex-col gap-6"
          >
            <div>
              <label className={labelClass}>Imagen de la receta</label>
              <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-300 file:text-brand-900 hover:cursor-pointer hover:file:cursor-pointer"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nombre del plato</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tiempo de preparación</label>
                <input
                  type="text" 
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Descripción</label>
                <textarea
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={inputClass}
                ></textarea>
              </div>
              <div>
                <label className={labelClass}>Dificultad</label>
                <select
                  value={editDificulty}
                  onChange={(e) => setEditDificulty(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Media">Media</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>


            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-bold text-brand-900 font-primary">Ingredientes</label>
                <button
                  type="button"
                  onClick={() => setEditIngredientes([...editIngredientes, ""])}
                  className="text-sm bg-brand-300 text-brand-900 px-3 py-1 rounded-full hover:bg-green-200 font-semibold transition"
                >
                  Añadir ingrediente
                </button>
              </div>
              <div className="space-y-3">
                {editIngredientes.map((ingrediente, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-gray-400 font-mono text-sm w-6 text-right">{index + 1}.</span>
                    <input
                      type="text"
                      value={ingrediente}
                      onChange={(e) => {
                        const nuevosIngredientes = [...editIngredientes];
                        nuevosIngredientes[index] = e.target.value;
                        setEditIngredientes(nuevosIngredientes);
                      }}
                      className={inputClass}
                    />
                     <button 
                        type="button"
                        className="text-red-400 hover:text-red-600 px-2"
                        onClick={() => {
                            const nuevos = editIngredientes.filter((_, i) => i !== index);
                            setEditIngredientes(nuevos);
                        }}
                     >✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección Pasos */}
            <div className="bg-brand-300 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <label className="text-lg font-bold text-brand-900 font-primary">Pasos de preparación</label>
                <button
                  type="button"
                  onClick={() => setEditPasos([...editPasos, ""])}
                  className="btn px-3 text-sm"
                >
                Añadir paso
                </button>
              </div>
              <div className="space-y-4">
                {editPasos.map((paso, index) => (
                  <div key={index} className="flex gap-4 items-start">
                     <span className="text-3xl font-bold text-brand-900 font-secondary mt-1">
                        {index + 1}º
                     </span>
                    <textarea
                      rows="2"
                      value={paso}
                      onChange={(e) => {
                        const nuevosPasos = [...editPasos];
                        nuevosPasos[index] = e.target.value;
                        setEditPasos(nuevosPasos);
                      }}
                      className={inputClass}
                    />
                    <button 
                        type="button"
                        className="text-red-400 hover:text-red-600 mt-3"
                        onClick={() => {
                            const nuevos = editPasos.filter((_, i) => i !== index);
                            setEditPasos(nuevos);
                        }}
                     >✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100 justify-end">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-8 py-2 rounded-lg bg-brand-900 text-white hover:bg-green-800 font-medium shadow-md transition transform hover:scale-105"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      ) : (
  
        <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-6 w-full md:w-5/12">
            <div className="rounded-lg"> 
              <img 
                className="w-full h-auto rounded-xl object-cover shadow-sm" 
                src={receta.image} 
                alt={receta.name} 
              />
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold font-primary text-brand-900 mb-4 w-fit pb-1">Ingredientes</h2>
              <ul className="space-y-3">
                {receta.ingredientes.map((ingrediente, index) => (
                  <li key={index} className="text-brand-900 flex items-center gap-2 s">
                    {ingrediente}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 mt-8 pt-4  text-sm">
              <button 
                onClick={() => setIsEditing(true)} 
                hidden={!ownRecipe} 
                className="btn px-4"
              >
                Editar receta
              </button>
              <button hidden={!ownRecipe} className="px-4 rounded-full font-semibold py-3 bg-red-700 text-white shadow-md transition duration-300 cursor-pointer">
                Eliminar receta
              </button>
              <button hidden={!admin} className="px-4 rounded-full font-semibold py-3 bg-red-700 text-white shadow-md transition duration-300 cursor-pointer">
                Ocultar receta
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-7/12 relative text-brand-900">
            <div className="flex justify-between items-start mb-2 gap-4">
              <h1 className="text-5xl font-primary font-bold leading-tight text-brand-900">
                {receta.name}
              </h1>
              <button className="bg-brand-900 text-white text-xs font-semibold py-2 px-5 rounded-full hover:bg-green-800 shadow-md transition-all shrink-0 mt-2">
                Añadir a favoritos
              </button>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <img
                src={autorReceta.image}
                alt={autorReceta.name}
                className="h-10 w-10 object-cover rounded-full  "
              />
              <span className="font-bold text-sm">{autorReceta.name}</span>
            </div>

            <div className="flex gap-16 mb-10 pb-6 border-b border-gray-100">
              <div className="flex flex-col items-center">
                <h3 className="font-bold font-secondary text-lg mb-1">Dificultad</h3>
                <span className="font-medium text-brand-900">
                    {receta.dificulty}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="font-bold font-secondary text-lg mb-1">Tiempo</h3>
                <p className="font-medium text-brand-900">
                    {receta.time}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {receta.pasos.map((paso, index) => (
                <div 
                  key={index} 
                  className="bg-brand-300 rounded-2xl p-6 flex gap-6 items-start shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-5xl font-bold font-secondary text-brand-900 leading-none">
                    {index + 1}º
                  </span>
                  <p className="leading-relaxed text-brand-900 pt-2 text-lg">
                    {paso}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}