import { listUsers } from "../data";

function Usuario({ user }) {
  return (
    <div
      className="
      flex flex-col
      rounded-lg
      bg-brand-300
      text-brand-900
      shadow-lg
      shadow-brand-300
      hover:-translate-y-2
      hover:shadow-xl
      transition
      duration-300
      ease-in-out
      h-full
    "
    >
      <img
        className="w-full  h-30 md:h-50 object-cover rounded-t-lg"
        src={user.image}
        alt={user.name}
        width="100"
      />
      <div className="px-4 py-2 gap-4 flex flex-col">
        <h2 className="font-primary font-bold text-2xl mt-2">{user.name}</h2>
        <p>{user.about}</p>
      </div>
    </div>
  );
}

export default function UserSearch({ busqueda = "Chi" }) {
  const busquedaStr = String(busqueda);

  const listaUsuarios = listUsers.filter((user) =>
    user.name.toLowerCase().includes(busquedaStr.toLowerCase()),
  );

  return (
    <div>
      <h1 className="font-primary font-bold text-3xl text-brand-900 p-10 px-15">Busqueda : {busqueda}</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-15 items-stretch ">
        {listaUsuarios.map((user) => (
          <li key={user.id}>
            <Usuario user={user} />
          </li>
        ))}
      </ul>
    </div>
  );
}
