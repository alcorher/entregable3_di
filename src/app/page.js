import Image from "next/image";


export default function Home() {
  return (
    <>
      <header>
        <img
          src="/images/logo.png"
          alt="Sazón Comunitario Logo"
          height="80px"
        />
        <nav className="">
          <button>Registrate</button>
          <button>Inicia sesión</button>
        </nav>
      </header>

      <section className="bg-primary">
        <div>
          <h2>Descubre recetas deliciosas y conecta con otros chefs</h2>
          <p>
            Sazón Comunitario es tu lugar para encontrar recetas caseras,
            compartir tus propias creaciones y unirte a una comunidad de
            cocineros apasionados.
          </p>
        </div>
        <div>
          <p>Donde a tus recetas no les falta sazón</p>
          <button>Unirte ahora</button>
        </div>
      </section>

      <section>
        <div>
          <img src="/images/food/placeHolder.png" height="400px" />
        </div>
        <div>
          <h3>Carrillada de Cerdo</h3>
          <p>
            La carrillada de cerdo es un corte de carne muy popular que se
            extrae de la zona de las mejillas del cerdo. Su carne es jugosa,
            melosa y extremadamente tierna cuando se cocina a fuego lento.
          </p>
          <p>
            Esta receta es perfecta para quienes buscan un plato con sabor
            profundo y textura suave. Se puede preparar con una salsa de vino
            tinto o con caldo y verduras, en una cocción lenta que realza todos
            los matices del plato.
          </p>
          <button>Descubre cómo hacerlo tú mismo</button>
        </div>
      </section>

      <section>
        <h3>Opinión de usuarios</h3>

        <article>
          <h4>Las mejores recetas</h4>
          <p>Aquí encontré las recetas que usé para ganar masterchef</p>
          <img src="/images/food/placeHolder.png" height="70px" />
          <p>Arnau</p>
        </article>

        <article>
          <h4>Mi familia está encantada</h4>
          <p>
            Desde que uso Sazón Comunitario, las cenas son más emocionantes,
            !Todo es más fácil y delicioso!
          </p>
          <img src="/images/food/placeHolder.png" height="70px" />
          <p>Gertrudis</p>
        </article>

        <article>
          <h4>Cocinar como estudiante nunca fue tan fácil</h4>
          <p>Encuentro recetas rápidas y fáciles en tan solo un click</p>
          <img src="/images/food/placeHolder.png" height="70px" />
          <p>Diego</p>
        </article>
      </section>

      <section>
        <h3>Cómo funciona</h3>
        <div>
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="90"
              height="90"
              fill="currentColor"
              className="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </i>
          <h4>Regístrate Gratis</h4>
          <p>Únete en cuestión de segundos</p>
        </div>

        <div>
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="90"
              height="90"
              fill="currentColor"
              className="bi bi-book"
              viewBox="0 0 16 16"
            >
              <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
            </svg>
          </i>
          <h4>Descubre y aprende</h4>
          <p>Explora miles de recetas</p>
        </div>

        <div>
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="90"
              height="90"
              fill="currentColor"
              class="bi bi-box-arrow-up"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"
              />
              <path
                fillRule="evenodd"
                d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"
              />
            </svg>
          </i>
          <h4>Cocina y comparte</h4>
          <p>Comparte en cuestión de segundos</p>
        </div>
      </section>
    </>
  );
}
