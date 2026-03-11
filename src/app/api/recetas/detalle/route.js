import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const recetaId = searchParams.get('id');

    if (!recetaId) return NextResponse.json({ error: "Falta el ID" }, { status: 400 });

    // 1. Buscamos la receta y cruzamos con la tabla perfiles
    const { data: receta, error } = await supabase
      .from("recetas")
      .select(`*, perfiles (nombre, avatar_url, is_admin)`)
      .eq("id", recetaId)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!receta) return NextResponse.json({ error: "Receta no encontrada" }, { status: 404 });

    // 2. Comprobamos quién está viendo la receta (para los botones de editar/borrar)
    const { data: { user } } = await supabase.auth.getUser();
    let isOwnRecipe = false;
    let currentUserIsAdmin = false;

    if (user) {
      if (user.id === receta.autor_id) isOwnRecipe = true;
      const { data: profile } = await supabase.from("perfiles").select("is_admin").eq("id", user.id).single();
      if (profile?.is_admin) currentUserIsAdmin = true;
    }

    return NextResponse.json({ receta, isOwnRecipe, currentUserIsAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}


// ... (tu función GET actual se queda igual) ...

// Función para EDITAR la receta
export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id, titulo, descripcion, tiempo, dificultad, ingredientes, pasos } = await request.json();

    const { error } = await supabase
      .from("recetas")
      .update({ 
        titulo, descripcion, tiempo, dificultad, 
        ingredientes: JSON.stringify(ingredientes), 
        pasos: JSON.stringify(pasos) 
      })
      .eq("id", id)
      .eq("autor_id", user.id); // Seguridad: solo su creador puede editarla

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: "Receta actualizada" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// Función para BORRAR u OCULTAR la receta
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const recetaId = searchParams.get('id');
    const action = searchParams.get('action'); 
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    if (action === 'delete') {
      const { error } = await supabase.from("recetas").delete().eq("id", recetaId).eq("autor_id", user.id);
      if (error) throw error;
      return NextResponse.json({ message: "Eliminada" }, { status: 200 });
    } else if (action === 'hide') {
      const { data: profile } = await supabase.from("perfiles").select("is_admin").eq("id", user.id).single();
      if (!profile?.is_admin) return NextResponse.json({ error: "No eres admin" }, { status: 403 });

      const { error } = await supabase.from("recetas").update({ oculta: true }).eq("id", recetaId);
      if (error) throw error;
      return NextResponse.json({ message: "Ocultada" }, { status: 200 });
    }
    
    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}