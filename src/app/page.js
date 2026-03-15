import Image from "next/image";

export default function Home() {
  return (
    <>
      <header className="bg-brand-900 px-5 py-3 flex justify-between text-white items-center">
        <img
          src="/images/logo.png"
          alt="Sazón Comunitario Logo"
          className="h-10"
        />
        <nav className="flex items-center">
          <a href="/registro">
            <button className="text-sm rounded-full font-semibold py-3 bg-brand-600 text-brand-900 shadow-md transition duration-300 cursor-pointer px-5 mx-3 hover:scale-105">
              Regístrate
            </button>
          </a>
          <a href="/inicioSesion">
            <button className="text-sm rounded-full font-semibold py-3 bg-brand-600 text-brand-900 shadow-md transition duration-300 cursor-pointer px-5 hover:scale-105">
              Inicia sesión
            </button>
          </a>
        </nav>
      </header>

      <section className="relative w-full lg:h-[70vh] min-h-[500px] py-20 lg:py-0">
        <img
          src="/images/landingHero.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 w-full text-white">
            <div className="lg:px-10 flex flex-col justify-around">
              <div className="text-center scale-125">
                <h1
                  className="font-primary text-brand-600 font-bold leading-none
                       text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
                >
                  SAZÓN
                </h1>

                <p className="font-secondary text-brand-600 tracking-[0.35em] mt-3 text-lg">
                  COMUNITARIO
                </p>
              </div>

              <h2 className="mt-6 text-2xl font-semibold">
                Descubre recetas deliciosas y conecta con otros chefs
              </h2>

              <p className="mt-4 max-w-lg mx-auto lg:mx-0 text-white/90">
                Sazón Comunitario es tu lugar para encontrar recetas caseras,
                compartir tus propias creaciones y unirte a una comunidad de
                cocineros apasionados.
              </p>
            </div>

            <div className="flex flex-col items-center justify-around text-center gap-6">
              <img
                src="/images/logoNoText.png"
                alt="Logo"
                className="h-32 lg:h-65"
              />

              <p className="font-primary text-2xl">
                Donde a tus recetas no les falta sazón
              </p>

              <a href="/registro">
                <button className="btn px-8 py-3 text-sm hover:scale-105 transition-transform cursor-pointer">
                  Únete ahora
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5/6 md:max-w-4/6 mx-auto my-12 px-4">
        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg border-brand-900/50 border-2">
          <div className="w-full md:w-1/2 h-96 md:h-auto relative">
            <img
              src="/images/carrillada.png"
              alt="Carrillada de Cerdo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          <div className="w-full md:w-1/2 bg-brand-600 p-10 md:p-14  flex flex-col justify-center">
            <h3 className="text-4xl font-serif text-brand-900 mb-6">
              Carrillada de Cerdo
            </h3>
            
            <div className="text-brand-900 text-base leading-relaxed space-y-4 mb-8">
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
            </div>

            <a href="/registro" className="w-fit">
              <button className="bg-brand-900 text-white font-medium py-3 px-8 rounded-full shadow-sm cursor-pointer hover:scale-105 duration-300 transition-all">
                Descubre como hacerlo tú mismo
              </button>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-brand-900/50 p-10">
        <h3 className="font-primary text-white text-3xl mb-8 text-center md:text-left">
          Opinión de usuarios
        </h3>
        
        <div className="flex flex-col md:flex-row justify-around gap-12">
          <article className="bg-brand-900 text-brand-600 rounded-xl p-6 flex flex-col w-full md:w-1/3 gap-3">
            <h4 className="text-xl font-medium">Las mejores recetas</h4>
            <p className="flex-grow">Aquí encontré las recetas que usé para ganar masterchef.</p>
            <div className="flex mt-2 items-center">
              <img 
                src="/images/arnau.png" 
                alt="Arnau" 
                className="h-10 w-10 object-cover rounded-full mr-4" 
              />
              <p className="font-medium">Arnau</p>
            </div>
          </article>

          <article className="bg-brand-900 text-brand-600 rounded-xl p-6 flex flex-col w-full md:w-1/3 gap-3">
            <h4 className="text-xl font-medium">Mi familia está encantada</h4>
            <p className="flex-grow">
              Desde que uso Sazón Comunitario, las cenas son más emocionantes. ¡Todo es más fácil y delicioso!
            </p>
            <div className="flex mt-2 items-center">
              <img 
                src="/images/gertru.png" 
                alt="Gertrudis" 
                className="h-10 w-10 object-cover rounded-full mr-4" 
              />
              <p className="font-medium">Gertrudis</p>
            </div>
          </article>

          <article className="bg-brand-900 text-brand-600 rounded-xl p-6 flex flex-col w-full md:w-1/3 gap-3">
            <h4 className="text-xl font-medium">Cocinar como estudiante</h4>
            <p className="flex-grow">Encuentro recetas rápidas y fáciles en tan solo un click.</p>
            <div className="flex mt-2 items-center">
              <img 
                src="/images/diego.png" 
                alt="Diego" 
                className="h-10 w-10 object-cover rounded-full mr-4" 
              />
              <p className="font-medium">Diego</p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-brand-600 text-center text-green-900 py-12 px-6 rounded-xl mx-auto max-w-5/6 md:max-w-4/6 my-10">
        <h3 className="text-3xl font-primary mb-12">Como funciona</h3>
        <div className="flex flex-col md:flex-row justify-around gap-8">
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <h4 className="text-2xl mb-2">Regístrate Gratis</h4>
            <p className="text-sm">Únete en cuestión de segundos</p>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h4 className="text-2xl mb-2">Descubre y aprende</h4>
            <p className="text-sm">Explora miles de recetas</p>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.2"
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <h4 className="text-2xl mb-2">Cocina y comparte</h4>
            <p className="text-sm">Sube tus propias creaciones</p>
          </div>
        </div>
      </section>
    </>
  );
}