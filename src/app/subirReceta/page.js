'use client';
import { useState } from "react";

export default function subirReceta() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [dificulty, setDificulty] = useState("Fácil");
    const [time, setTime] = useState("00:30");
    const [ingredientes, setIngredientes] = useState([""]);
    const [pasos, setPasos] = useState([""]);
    const [recetaGuardada, setRecetaGuardada] = useState({});

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
    <div>
      <h2>Subir Receta</h2>
      <form
        onSubmit={(e) => {
          guardarReceta(e);
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
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <br />
        <label>
          Descripción:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </label>
        <br />
        <label>
          Dificultad:
          <select
            value={dificulty}
            onChange={(e) => setDificulty(e.target.value)}
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
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <br />

        <button
          type="button"
          onClick={() => setIngredientes([...ingredientes, ""])}
        >
          Añadir otro ingrediente
        </button>
        {ingredientes.map((ingrediente, index) => (
          <div key={index}>
            <label>
              Ingrediente {index + 1}:
              <input
                type="text"
                value={ingrediente}
                onChange={(e) => {
                  const nuevosIngredientes = [...ingredientes];
                  nuevosIngredientes[index] = e.target.value;
                  setIngredientes(nuevosIngredientes);
                }}
              />
            </label>
          </div>
        ))}

        <br />
        <button type="button" onClick={() => setPasos([...pasos, ""])}>
          Añadir otro paso
        </button>
        {pasos.map((paso, index) => (
          <div key={index}>
            <label>
              Paso {index + 1}:
              <input
                type="text"
                value={paso}
                onChange={(e) => {
                  const nuevosPasos = [...pasos];
                  nuevosPasos[index] = e.target.value;
                  setPasos(nuevosPasos);
                }}
              />
            </label>
          </div>
        ))}

        <br />
        <button type="submit">Guardar</button>
        <a href="/"><button type="button"> Cancelar </button></a>
      </form>
    </div>
  );
}
