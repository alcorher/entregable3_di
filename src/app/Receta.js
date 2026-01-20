export default function RecetaCard({ recipe }) {
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
        src={recipe.image}
        alt={recipe.name}
        className="w-full  h-30 md:h-50 object-cover rounded-t-lg"
      />

      <div className="px-4 py-2 gap-4 flex flex-col">
        <h2 className="font-primary font-bold text-2xl mt-2">{recipe.name}</h2>
        <p>{recipe.description}</p>
      </div>

      <div className="px-4 py-2 flex flex-row flex-wrap gap-2 flex-1 items-end">
        <span className="bg-brand-900 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
          {recipe.dificulty}
        </span>
        <span className="bg-brand-900 text-white rounded-full px-2 py-0.5 text-xs font-semibold">
          {recipe.time}
        </span>
      </div>
    </div>
  );
}
