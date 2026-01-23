"use client";
import { useState } from "react";
import { listUsers } from "../data";

//El usuario inicial es Chicote
const initialUser = listUsers[0];

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
      {isEditing ? (
        <div>
          <h2>Editar Perfil</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUser({ ...user, name: editName, about: editAbout });
              setIsEditing(false);
            }}
          >
            <label>
              Foto de perfil:
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
              Sobre mí:
              <textarea
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
              ></textarea>
            </label>
            <br />
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </form>
        </div>
      ) : (
        <div>
          <img
            className="w-auto h-2/5 mx-auto mt-10 rounded-2xl"
            src={user.image}
            alt={user.name}
          />
          <h1 className="font-primary font-bold text-5xl text-brand-900 p-10 px-15 text-center">
            {user.name}
          </h1>
          <div className="mx-auto w-5/6 px-15">
            <h2 className="font-primary font-semibold text-3xl text-brand-900 mb-10 ">
              Sobre mí
            </h2>
            <p className="text-brand-900 ">{user.about}</p>
            <div className="flex gap-6 my-10 justify-center max-w-3xl mx-auto">
              <a href="/listaRecetas" className="w-1/2">
                <button className="btn w-full py-3">Lista de recetas</button>
              </a>

              {ownUser && (
                <button
                  className="btn w-1/2 py-3"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </button>
              )}

              {admin && (
                <button className="rounded-full font-semibold text-white shadow-md transition duration-300 bg-red-700 w-1/2 py-3">Banear usuario</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
