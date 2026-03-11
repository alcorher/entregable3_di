"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function RecetaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recetaId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [ownRecipe, setOwnRecipe] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [receta, setReceta] = useState(null);
  const [autor, setAutor] = useState(null);

  // Estados del formulario de edición
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDificulty, setEditDificulty] = useState("Fácil");
  const [editTime, setEditTime] = useState("");
  const [editIngredientes, setEditIngredientes] = useState([]);
  const [editPasos, setEditPasos] = useState([]);

  useEffect(() => {
    async function fetchDetalle() {
      if (!recetaId) return setLoading(false);
      try {
        const res = await fetch(`/api/recetas/detalle?id=${recetaId}`);
        if (res.ok) {
          const data = await res.json();
          const ingParsed = data.receta.ingredientes ? JSON.parse(data.receta.ingredientes) : [];
          const pasParsed = data.receta.pasos ? JSON.parse(data.receta.pasos) : [];
          
          setReceta({ ...data.receta, ingredientes: ingParsed, pasos: pasParsed });
          setAutor(data.receta.perfiles);
          setOwnRecipe(data.isOwnRecipe);
          setAdmin(data.currentUserIsAdmin);

          setEditName(data.receta.titulo);
          setEditDescription(data.receta.descripcion);
          setEditDificulty(data.receta.dificultad);
          setEditTime(data.receta.tiempo);
          setEditIngredientes(ingParsed);
          setEditPasos(pasParsed);
        }
      } catch (error) {
        console.error("Error cargando receta", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetalle();
  }, [recetaId]);

  // Lógica de favoritos
  useEffect(() => {
    async function checkFavorite() {
      if (!recetaId) return;
      const res = await fetch("/api/favoritos");
      if (res.ok) {
        const favoritos = await res.json();
        setIsFavorite(favoritos.some(f => f.id === recetaId));
      }
    }
    checkFavorite();
  }, [recetaId]);

  const toggleFavorito = async () => {
    const method = isFavorite ? "DELETE" : "POST";
    const url = isFavorite ? `/api/favoritos?id=${recetaId}` : "/api/favoritos";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: isFavorite ? null : JSON.stringify({ recetaId })
    });
    if (res.ok) setIsFavorite(!isFavorite);
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/recetas/detalle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: recetaId,
        titulo: editName,
        descripcion: editDescription,
        tiempo: editTime,
        dificultad: editDificulty,
        ingredientes: editIngredientes,
        pasos: editPasos
      }),
    });

    if (res.ok) {
      setReceta({ ...receta, titulo: editName, descripcion: editDescription, tiempo: editTime, dificultad: editDificulty, ingredientes: editIngredientes, pasos: editPasos });
      setIsEditing(false);
      alert("Receta actualizada");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-xl text-brand-900">Cargando receta...</div>;
  if (!receta) return <div className="p-10 text-center text-red-600">Receta no encontrada.</div>;

  return (
    <>
      {isEditing ? (
        <div className="max-w-4xl mx-auto p-8 my-8">
          <h2 className="text-3xl font-primary font-bold text-brand-900 mb-8 pb-4">Editar Receta</h2>
          <form onSubmit={guardarCambios} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-3 border rounded" placeholder="Nombre" />
              <input type="text" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="w-full p-3 border rounded" placeholder="Tiempo" />
            </div>
            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full p-3 border rounded" placeholder="Descripción" rows="3" />
            <div className="flex gap-4 justify-end">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-600">Cancelar</button>
              <button type="submit" className="px-8 py-2 bg-brand-900 text-white rounded">Guardar</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto p-6">
          <div className="flex flex-col gap-6 w-full md:w-5/12">
            <img className="w-full rounded-xl object-cover shadow-sm" src={receta.imagen_url || "/images/food/placeHolder.png"} alt={receta.titulo} />
            <h2 className="text-2xl font-bold font-primary text-brand-900">Ingredientes</h2>
            <ul className="space-y-3">
              {receta.ingredientes.map((ing, i) => <li key={i} className="text-brand-900">• {ing}</li>)}
            </ul>
            <div className="flex gap-3 mt-4">
              {ownRecipe && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-brand-300 rounded font-bold">Editar</button>}
              {admin && !ownRecipe && <button className="px-4 py-2 bg-gray-700 text-white rounded font-bold">Ocultar</button>}
            </div>
          </div>
          <div className="flex flex-col w-full md:w-7/12 text-brand-900">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-5xl font-primary font-bold leading-tight">{receta.titulo}</h1>
              <button onClick={toggleFavorito} className={`${isFavorite ? 'bg-red-600' : 'bg-brand-900'} text-white py-2 px-5 rounded-full text-xs font-semibold`}>
                {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              </button>
            </div>
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => router.push(`/perfilUsuario?userId=${receta.autor_id}`)}>
              <img src={autor?.avatar_url || "/images/gertru.png"} className="h-10 w-10 rounded-full object-cover" />
              <span className="font-bold">{autor?.nombre}</span>
            </div>
            <p className="text-lg mb-8">{receta.descripcion}</p>
            <div className="flex flex-col gap-6">
              {receta.pasos.map((paso, i) => (
                <div key={i} className="bg-brand-300 rounded-2xl p-6 flex gap-6 items-start">
                  <span className="text-5xl font-bold font-secondary">{i + 1}º</span>
                  <p className="text-lg pt-2">{paso}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando receta...</div>}>
      <RecetaContent />
    </Suspense>
  );
}