"use client";
import { useState } from "react";
import { listUsers } from "../data";

// El usuario inicial es Chicote
const initialUser = listUsers[0];

export default function perfilUsuario({}) {
  const [user, setUser] = useState(initialUser);
  const [ownUser, setOwnUser] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAbout, setEditAbout] = useState(user.about);

  const labelClass = "block text-sm font-bold text-brand-900 mb-2 font-primary";
  const inputClass =
    "w-full p-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors bg-white text-gray-700";

  return (
    <div className="md:max-w-5/6 mx-auto p-6">
      <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
        <button onClick={() => setOwnUser(!ownUser)} disabled={admin}>
          {ownUser ? "Ver como otro usuario" : "Ver como dueño del perfil"}
        </button>
        <button onClick={() => setAdmin(!admin)} disabled={ownUser}>
          {admin ? "Desactivar modo admin" : "Activar modo admin"}
        </button>
      </div>

      {isEditing ? (
        <div className="md:shadow-lg md:rounded-2xl p-8 my-8">
          <h2 className="text-3xl font-primary font-bold text-brand-900 mb-8 pb-4">
            Editar Perfil
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setUser({ ...user, name: editName, about: editAbout });
              setIsEditing(false);
            }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <label className={labelClass}>Foto de perfil</label>
                <div className="flex flex-col items-center gap-4 p-4 rounded-xl ">
                  <div className="w-20 h-20 rounded-full overflow-hidden ">
                    <img
                      src={user.image}
                      alt="Foto de perfil actual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    className="block w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-300 file:text-brand-900 hover:cursor-pointer hover:file:cursor-pointer"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-6">
                <div>
                  <label className={labelClass}>Nombre</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Sobre mí</label>
                  <textarea
                    rows="5"
                    value={editAbout}
                    onChange={(e) => setEditAbout(e.target.value)}
                    className={inputClass}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-100 justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-2 rounded-lg bg-brand-900 text-white  font-medium shadow-md cursor-pointer"
              >
                Guardar cambios
              </button>
            </div>
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

          <div className="mx-auto md:w-5/6 px-15">
            <h2 className="font-primary font-semibold text-3xl text-brand-900 mb-10">
              Sobre mí
            </h2>

            <p className="text-brand-900">{user.about}</p>

            <div className="flex flex-col md:flex-row gap-6 my-10 justify-center mx-auto">
              <a href="/listaRecetas" className="w-full md:w-1/2">
                <button className="btn w-full py-3">Lista de recetas</button>
              </a>

              {ownUser && (
                <button
                  className="btn w-full md:w-1/2 py-3"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </button>
              )}

              {admin && (
                <button className="rounded-full font-semibold text-white shadow-md transition duration-300 bg-red-700 w-full md:w-1/2 py-3">
                  Banear usuario
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
