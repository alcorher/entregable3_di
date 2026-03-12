import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Obtenemos el usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Verificamos si nos pasan un userId por la URL (para ver el perfil de otros)
    const { searchParams } = new URL(request.url);
    const userIdUrl = searchParams.get('userId');

    // El ID a buscar será el de la URL o, si no hay, el del usuario logueado
    const targetUserId = userIdUrl || user?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: "No autorizado o ID no proporcionado" }, { status: 401 });
    }

    // Buscamos el perfil en la base de datos
    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", targetUserId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Calculamos si el usuario actual es el dueño del perfil o si es admin
    const isOwnProfile = user?.id === targetUserId;
    
    let currentUserIsAdmin = false;
    if (user) {
      const { data: currentProfile } = await supabase
        .from("perfiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      currentUserIsAdmin = currentProfile?.is_admin || false;
    }

    return NextResponse.json({ ...perfil, isOwnProfile, currentUserIsAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient();
    
    // 1. Verificamos quién es el usuario logueado
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Extraemos los datos que envía el frontend (¡INCLUYENDO avatar_url!)
    const { nombre, sobre_mi, avatar_url } = await request.json();

    // 3. Actualizamos la tabla 'perfiles' del usuario logueado
    const { error } = await supabase
      .from("perfiles")
      .update({
        nombre: nombre,
        sobre_mi: sobre_mi,
        avatar_url: avatar_url // <-- ESTA LÍNEA ES LA QUE TE FALTABA
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Perfil actualizado correctamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}