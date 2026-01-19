"use client";
import { listUsers } from "../data";
import { useState } from "react";

const dueñoReceta = listUsers[0][0];

const recipe = [
    {
        id: 1,
        name: "Patatas fritas",
        description: "Crispy fried potatoes",
        dificulty: "Fácil",
        time: "30 minutos",
        image: "images/food/papasAlAjillo.png",
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

    return (
        <>
            <button onClick={() => setOwnRecipe(!ownRecipe)} disabled={admin}>
                {ownRecipe ? "Ver como otro usuario" : "Ver como dueño de la receta"}
            </button>
            <button onClick={() => setAdmin(!admin)} disabled={ownRecipe}>
                {admin ? "Desactivar modo admin" : "Activar modo admin"}
            </button>

            {isEditing ? (
                <div>
                    <h2>Editar Receta</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            editarReceta();
                            setIsEditing(false);
                        }}
                    >
                        <label>
                            Imagen de la receta:
                            <input type="file" />
                        </label>

                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>
                            Descripción:
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            ></textarea>
                        </label>
                        <br />
                        <label>
                            Dificultad:
                            <select
                                value={editDificulty}
                                onChange={(e) => setEditDificulty(e.target.value)}
                            >
                                <option value="Fácil">Fácil</option>
                                <option value="Media">Media</option>
                                <option value="Difícil">Difícil</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            Tiempo de preparación:
                            <input
                                type="time"
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                            />
                        </label>
                        <br />

                        <button
                            type="button"
                            onClick={() => setEditIngredientes([...editIngredientes, ""])}
                        >
                            Añadir otro ingrediente
                        </button>
                        {editIngredientes.map((ingrediente, index) => (
                            <div key={index}>
                                <label>
                                    Ingrediente {index + 1}:
                                    <input
                                        type="text"
                                        value={ingrediente}
                                        onChange={(e) => {
                                            const nuevosIngredientes = [...editIngredientes];
                                            nuevosIngredientes[index] = e.target.value;
                                            setEditIngredientes(nuevosIngredientes);
                                        }}
                                    />
                                </label>
                            </div>
                        ))}

                        <br />
                        <button
                            type="button"
                            onClick={() => setEditPasos([...editPasos, ""])}
                        >
                            Añadir otro paso
                        </button>
                        {editPasos.map((paso, index) => (
                            <div key={index}>
                                <label>
                                    Paso {index + 1}:
                                    <input
                                        type="text"
                                        value={paso}
                                        onChange={(e) => {
                                            const nuevosPasos = [...editPasos];
                                            nuevosPasos[index] = e.target.value;
                                            setEditPasos(nuevosPasos);
                                        }}
                                    />
                                </label>
                            </div>
                        ))}

                        <br />
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <>
                        <img src={receta.image} alt={receta.name} />
                    </>
                    <ul>
                        {receta.ingredientes.map((ingrediente, index) => (
                            <li key={index}>{ingrediente}</li>
                        ))}
                    </ul>
                    <button onClick={() => setIsEditing(true)} hidden={!ownRecipe}>
                        Editar receta
                    </button>
                    <button hidden={!ownRecipe}>Eliminar receta</button>
                    <button hidden={!admin}>Ocultar receta</button>
                    <>
                        <h1>{receta.name}</h1>
                        <button>Añadir a favoritos</button>
                        <p>
                            {" "}
                            <img src={autorReceta.image} width={80} alt={autorReceta.name} />
                            {autorReceta.name}
                        </p>
                        <p>Dificultad: {receta.dificulty}</p>
                        <p>Tiempo de preparación: {receta.time}</p>
                        <ol>
                            {receta.pasos.map((paso, index) => (
                                <li key={index}>{paso}</li>
                            ))}
                        </ol>
                    </>
                </div>
            )}
        </>
    );
}
