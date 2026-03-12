import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const recetaId = searchParams.get('id');

    if (!recetaId) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
    }

    const { data: receta, error } = await supabase
      .from("recetas")
      .select(`
        *,
        perfiles (
          nombre,
          avatar_url,
          is_admin
        )
      `)
      .eq("id", recetaId)
      .maybeSingle();

    if (error) {
      console.error("Error de Supabase:", error);
      return NextResponse.json({ error: "Error en la consulta a la base de datos" }, { status: 400 });
    }

    if (!receta) {
      return NextResponse.json({ error: "La receta no existe" }, { status: 404 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    let isOwnRecipe = false;
    let currentUserIsAdmin = false;

    if (user) {
      isOwnRecipe = user.id === receta.autor_id;
      const { data: currentProfile } = await supabase
        .from("perfiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      if (currentProfile?.is_admin) currentUserIsAdmin = true;
    }

    return NextResponse.json({ receta, isOwnRecipe, currentUserIsAdmin }, { status: 200 });
    
  } catch (error) {
    console.error("Error crítico en API GET:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// NUEVO: Método PUT para actualizar la receta (incluyendo la imagen)
export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, titulo, descripcion, tiempo, dificultad, ingredientes, pasos, imagen_url } = await request.json();

    const { error } = await supabase
      .from("recetas")
      .update({
        titulo: titulo,
        descripcion: descripcion,
        tiempo: tiempo,
        dificultad: dificultad,
        ingredientes: JSON.stringify(ingredientes),
        pasos: JSON.stringify(pasos),
        imagen_url: imagen_url
      })
      .eq('id', id)
      .eq('autor_id', user.id); // Validamos que solo el autor pueda editarla

    if (error) {
      console.error("Error al actualizar la receta:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Receta actualizada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error crítico en API PUT:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// NUEVO: Método DELETE para poder borrar la receta
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recetaId = searchParams.get('id');

    if (!recetaId) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
    }

    const { error } = await supabase
      .from("recetas")
      .delete()
      .eq('id', recetaId)
      .eq('autor_id', user.id); // Validamos que solo el autor pueda eliminarla

    if (error) {
      console.error("Error al eliminar la receta:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Receta eliminada correctamente" }, { status: 200 });
  } catch (error) {
    console.error("Error crítico en API DELETE:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}