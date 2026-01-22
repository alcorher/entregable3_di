import {listRecipes} from "../data";
import RecetaCard from "../Receta";


export default function RecetaSearch({ busqueda='Pa' }) {
    const busquedaStr = String(busqueda);

    const listaRecetas = listRecipes.filter((receta) =>
        receta.name.toLowerCase().includes(busquedaStr.toLowerCase())
    );
  
   
  return (
   <div>
     <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">Busqueda : {busqueda}</h1>
       <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch ">
            {listaRecetas.map((receta) => (
                <li key={receta.id}><RecetaCard recipe={receta} /></li>
            ))}
        </ul>      
    </div>
  );
}