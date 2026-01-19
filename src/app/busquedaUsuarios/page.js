import {listUsers} from "../data";

function Usuario({user}) {
    return (
        <div>
            <img src={user.image} alt={user.name} width="100" />
            <h2>{user.name}</h2>
            <p>{user.about}</p>
        </div>
    );
}



export default function UserSearch({ busqueda='Chi' }) {
    const busquedaStr = String(busqueda);

    const listaUsuarios = listUsers.filter((user) =>
        user.name.toLowerCase().includes(busquedaStr.toLowerCase())
    );
  
   
  return (
   <div>
     <h1>Busqueda : {busqueda}</h1>
        <ul>
            {listaUsuarios.map((user) => (
                <li key={user.id}><Usuario user={user} /></li>
            ))}
        </ul>      
    </div>
  );
}