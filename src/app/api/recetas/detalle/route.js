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

export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, titulo, descripcion, tiempo, dificultad, ingredientes, pasos, imagen_url } = await request.json();

    // --- NUEVO: Validación de backend ---
    const tituloLimpio = titulo?.trim() || "";
    const descripcionLimpia = descripcion?.trim() || "";
    const tiempoLimpio = tiempo?.trim() || "";

    if (!tituloLimpio || !descripcionLimpia || !tiempoLimpio) {
      return NextResponse.json({ error: "Faltan campos obligatorios o están en blanco." }, { status: 400 });
    }
    if (tituloLimpio.length > 60) {
      return NextResponse.json({ error: "El título no puede exceder los 60 caracteres." }, { status: 400 });
    }
    if (descripcionLimpia.length > 300) {
      return NextResponse.json({ error: "La descripción no puede exceder los 300 caracteres." }, { status: 400 });
    }

    const ingredientesValidos = Array.isArray(ingredientes) ? ingredientes.filter(i => typeof i === 'string' && i.trim() !== "") : [];
    const pasosValidos = Array.isArray(pasos) ? pasos.filter(p => typeof p === 'string' && p.trim() !== "") : [];

    if (ingredientesValidos.length === 0 || pasosValidos.length === 0) {
      return NextResponse.json({ error: "Debe haber al menos un ingrediente y un paso válido." }, { status: 400 });
    }
    // -----------------------------------

    const { error } = await supabase
      .from("recetas")
      .update({
        titulo: tituloLimpio,
        descripcion: descripcionLimpia,
        tiempo: tiempoLimpio,
        dificultad: dificultad,
        ingredientes: JSON.stringify(ingredientesValidos),
        pasos: JSON.stringify(pasosValidos),
        imagen_url: imagen_url
      })
      .eq('id', id)
      .eq('autor_id', user.id); 

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
      .eq('autor_id', user.id); 

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

export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Comprobar si el usuario es administrador
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!perfil?.is_admin) {
      return NextResponse.json({ error: "No tienes permisos de administrador" }, { status: 403 });
    }

    // Obtener el ID de la receta y el nuevo estado (true/false)
    const { searchParams } = new URL(request.url);
    const recetaId = searchParams.get('id');
    const { oculto } = await request.json();

    if (!recetaId) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
    }

    const { error } = await supabase
      .from("recetas")
      .update({ oculta: oculto })
      .eq('id', recetaId);

    if (error) {
      console.error("Error al cambiar visibilidad:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Visibilidad de la receta actualizada" }, { status: 200 });
  } catch (error) {
    console.error("Error crítico en API PATCH:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}