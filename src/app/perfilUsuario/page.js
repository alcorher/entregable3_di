'use client';
import { useState } from "react";
import { listUsers } from "../data";


//El usuario inicial es Chicote
const initialUser = listUsers[0][0];

export default function perfilUsuario({}) {
    const [user, setUser] = useState(initialUser);
    const [ownUser, setOwnUser] = useState(true);
    const [admin, setAdmin] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editAbout, setEditAbout] = useState(user.about);


    return (
        


        <>

        <div>
            <button onClick={() => setOwnUser(!ownUser)} disabled={admin}>
                {ownUser ? "Ver como otro usuario" : "Ver como dueño del perfil"}
            </button>
            <button onClick={() => setAdmin(!admin)} disabled={ownUser}>
                {admin ? "Desactivar modo admin" : "Activar modo admin"}
            </button>
        </div>
        {(isEditing) ?
            (
                <div>
                    <h2>Editar Perfil</h2>
                    <form onSubmit={(e) => { e.preventDefault(); setUser({...user, name: editName, about: editAbout}); setIsEditing(false); }}>
                        <label>Foto de perfil:
                            <input type="file" />
                        </label>

                        <label>
                            Nombre:
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Sobre mí:
                            <textarea value={editAbout} onChange={(e) => setEditAbout(e.target.value)}></textarea>
                        </label>
                        <br />
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </form>
                </div>
            )
         : 

        <div>       
            <img src={user.image} alt={user.name} />
            <h1>{user.name}</h1>
            <p>{user.about}</p>
            <a href="/listaRecetas"><button>Lista de recetas</button></a>
            {ownUser && <button onClick={() =>setIsEditing(true)}>Editar perfil</button>}
            {admin && <button>Banear usuario</button>}
        </div>
        }
        </>
    );
}

