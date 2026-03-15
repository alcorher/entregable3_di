import { createClient } from "@/utils/supabase/server";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    

    let { id: userId } = await params;


    // Para acceder al perfil propio
    if (userId === 'me') {
      userId = user?.id;
    }

    if (!userId) {
      return Response.json({ error: "No autorizado o ID no proporcionado" }, { status: 401 });
    }

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return Response.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const isOwnProfile = user?.id === userId;
    
    let currentUserIsAdmin = false;
    if (user) {
      const { data: currentProfile } = await supabase
        .from("perfiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      currentUserIsAdmin = currentProfile?.is_admin || false;
    }

    return Response.json({ ...perfil, isOwnProfile, currentUserIsAdmin }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, sobre_mi, avatar_url } = await request.json();
    const nombreLimpio = nombre?.trim() || "";
    const sobreMiLimpio = sobre_mi?.trim() || null;

    if (!nombreLimpio) {
      return Response.json({ error: "El nombre no puede estar en blanco." }, { status: 400 });
    }
    if (nombreLimpio.length > 30) {
      return Response.json({ error: "El nombre no puede exceder los 30 caracteres." }, { status: 400 });
    }
    if (sobreMiLimpio && sobreMiLimpio.length > 300) {
      return Response.json({ error: "La sección 'Sobre mí' no puede exceder los 300 caracteres." }, { status: 400 });
    }

    const { error } = await supabase
      .from("perfiles")
      .update({
        nombre: nombreLimpio,
        sobre_mi: sobreMiLimpio,
        avatar_url: avatar_url 
      })
      .eq("id", user.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ message: "Perfil actualizado correctamente" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}