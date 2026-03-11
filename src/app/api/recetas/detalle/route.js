import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const recetaId = searchParams.get('id');

    // 1. Validar que el ID existe
    if (!recetaId) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
    }

    // 2. Consultar la receta con los datos del autor
    // Nota: Asegúrate de que los nombres de las tablas y columnas coincidan exactamente
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

    // 3. Si Supabase devuelve un error de sintaxis o conexión
    if (error) {
      console.error("Error de Supabase:", error);
      return NextResponse.json({ error: "Error en la consulta a la base de datos" }, { status: 400 });
    }

    // 4. Si la receta simplemente no existe
    if (!receta) {
      return NextResponse.json({ error: "La receta no existe" }, { status: 404 });
    }

    // 5. Comprobar permisos del usuario actual (opcional, no bloqueante)
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
    console.error("Error crítico en API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}