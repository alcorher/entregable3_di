'use client';
import { useState } from "react";

export default function SubirReceta() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [dificulty, setDificulty] = useState("Fácil");
    const [time, setTime] = useState("00:30");
    const [ingredientes, setIngredientes] = useState([""]);
    const [pasos, setPasos] = useState([""]);
    const [recetaGuardada, setRecetaGuardada] = useState({});

    // Styles defined as constants
    const labelClass = "block text-xl font-bold text-brand-900 mb-2 font-primary";
    const inputClass = "w-full p-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors bg-white text-gray-700";

    function guardarReceta(e) {
        e.preventDefault();
        const nuevaReceta = {
            nombre,
            descripcion,
            dificulty,
            time,
            ingredientes,
            pasos,
        };
        setRecetaGuardada(nuevaReceta);
        console.log("Receta guardada:", nuevaReceta);
        alert("Receta guardada con éxito.");
    }

    return (
        <div className="max-w-4xl mx-auto p-8 my-8">
            <h2 className="text-3xl font-primary font-bold text-brand-900 mb-8 pb-4">
                Subir Receta
            </h2>

            <form
                onSubmit={guardarReceta}
                className="flex flex-col gap-6"
            >

                <div>
                    <label className={labelClass}>Imagen de la receta</label>
                    <input 
                        type="file" 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-300 file:text-brand-900 hover:cursor-pointer hover:file:cursor-pointer" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Nombre del plato</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={inputClass}
                            placeholder="Ej. Paella Valenciana"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Tiempo de preparación</label>
                        <input
                            type="text"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Descripción</label>
                        <textarea
                            rows="3"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className={inputClass}
                            placeholder="Describe brevemente tu plato..."
                        ></textarea>
                    </div>
                    <div>
                        <label className={labelClass}>Dificultad</label>
                        <select
                            value={dificulty}
                            onChange={(e) => setDificulty(e.target.value)}
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
                            onClick={() => setIngredientes([...ingredientes, ""])}
                            className="text-sm bg-brand-300 text-brand-900 px-3 cursor-pointer py-1 rounded-full font-semibold transition"
                        >
                            Añadir ingrediente
                        </button>
                    </div>
                    <div className="space-y-3">
                        {ingredientes.map((ingrediente, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <span className="text-gray-400 font-mono text-sm w-6 text-right">{index + 1}.</span>
                                <input
                                    type="text"
                                    value={ingrediente}
                                    onChange={(e) => {
                                        const nuevosIngredientes = [...ingredientes];
                                        nuevosIngredientes[index] = e.target.value;
                                        setIngredientes(nuevosIngredientes);
                                    }}
                                    className={inputClass}
                                    placeholder="Ingrediente y cantidad"
                                />
                                <button
                                    type="button"
                                    className="text-red-400 hover:text-red-600 px-2"
                                    onClick={() => {
                                        const nuevos = ingredientes.filter((_, i) => i !== index);
                                        setIngredientes(nuevos);
                                    }}
                                >✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-brand-300 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-lg font-bold text-brand-900 font-primary">Pasos de preparación</label>
                        <button
                            type="button"
                            onClick={() => setPasos([...pasos, ""])}
                            className="btn"
                        >
                            Añadir paso
                        </button>
                    </div>
                    <div className="space-y-4">
                        {pasos.map((paso, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <span className="text-3xl font-bold text-brand-900 font-secondary mt-1">
                                    {index + 1}º
                                </span>
                                <textarea
                                    rows="2"
                                    value={paso}
                                    onChange={(e) => {
                                        const nuevosPasos = [...pasos];
                                        nuevosPasos[index] = e.target.value;
                                        setPasos(nuevosPasos);
                                    }}
                                    className={inputClass}
                                    placeholder={`Describe el paso ${index + 1}...`}
                                />
                                <button
                                    type="button"
                                    className="text-red-400 hover:text-red-600 mt-3"
                                    onClick={() => {
                                        const nuevos = pasos.filter((_, i) => i !== index);
                                        setPasos(nuevos);
                                    }}
                                >✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-6  justify-end">
                    <a href="/">
                        <button
                            type="button"
                            className="px-6 py-2 rounded-lg text-gray-600 font-medium transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </a>
                    <button
                        type="submit"
                        className="px-8 py-2 rounded-lg bg-brand-900 text-white font-medium shadow-md cursor-pointer"
                    >
                        Guardar Receta
                    </button>
                </div>
            </form>
        </div>
    );
}