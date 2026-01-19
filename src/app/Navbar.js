"use client";
import { usePathname } from "next/navigation";
//EL ICONO DE LA LUPA ES UN ICONO DE BOOTSTRAP, UNA VEZ LO IMPLEMENTEMOS, CAMBIARLO POR EL CODIGO DEL ICONO (<i class="bi bi-search"></i>)
export default function NavBar() {
  const location = usePathname();

  if (
    location === "/inicioSesion" ||
    location === "/registro" ||
    location === "/"
  ) {
    return null;
  }

  return (
    <nav className="navbar bg-brand-900 px-5 py-3">
      <ul className="flex justify-between items-center text-white">
        <li>
          {" "}
          <a href="/">
            <img src="/images/logo.png" className="h-10 w-auto ps-2" />
          </a>{" "}
        </li>
        <li>
          <form className=" focus:ring-0 focus:outline-none bg-white rounded-full flex items-center border-2 border-brand-600">
            <select 
              className="mx-3 bg-white text-brand-900 p-1.5 rounded-s-full focus:outline-none focus:ring-0 appearance-none "
              name="searchOption"
              defaultValue="Recetas"
              id="searchOption"
            >
              <option className="text-brand-900 " value="Recetas">Recetas</option>
              <option className="text-brand-900" value="Usuarios">Usuarios</option>
            </select>
            <input type="text" placeholder="Buscar" className="bg-white text-brand-900 p-1.5 focus:outline-none focus:ring-0 border-s-2 border-brand-600" />
            <button type="submit" className="text-brand-900  p-1.5  px-4 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-search text-brand-900 "
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </form>
        </li>
        <li className="flex gap-6 items-center pe-2">
          <a href="/nuevaReceta">
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="h-8 w-auto bi bi-plus-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
              </svg>
            </i>
          </a>

          <a href="/favoritos">
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="h-8 w-auto bi bi-heart-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                />
              </svg>
            </i>
          </a>

          <a href="/perfilUsuario">
            <img
              src="https://imgs.search.brave.com/CM9dCKfA9Wa0sdTIxbTCkj-hrAk1Uoa6d8pvYzsJtHk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjM1/MjQ2MTgwL2VzL2Zv/dG8vbWFkcmlkLXNw/YWluLXNwYW5pc2gt/Y2hlZi1hbGJlcnRv/LWNoaWNvdGUtcHJl/c2VudHMtdGhlLXRv/cC1jaGVmLXR2LXNo/b3ctYXQta2l0Y2hl/bi1jbHViLW9uLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1t/d1BTYTgwYUhaeHRV/aHZraVBIU0dUSzJ2/LThQOE56ZUZFNjUt/M1hSUDY4PQ"
              alt="Perfil"
              className="rounded-full h-10 w-10 object-cover"
            />
          </a>
        </li>
      </ul>
    </nav>
  );
}
