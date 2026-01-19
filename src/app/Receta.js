export default function RecetaCard({ recipe }) {
  return (
    <>
      <img src={recipe.image} alt={recipe.name} width="100" />
      <h2>{recipe.name}</h2>
      <p>{recipe.description}</p>
    </>
  );
}
