import { createClient } from '@/utils/supabase/server';

export async function GET(request, { params }) {
  try {
    const parametros = await params;
    const userId = parametros.id;

    if (!userId) {
      return Response.json({ error: "Falta el ID del usuario en la URL" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("nombre")
      .eq("id", userId)
      .single();

    const { data: recetas, error } = await supabase
      .from("recetas")
      .select(`*, perfiles (nombre, avatar_url)`)
      .eq("autor_id", userId)
      .order("fecha_creacion", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ 
      recetas, 
      username: perfil?.nombre || "Usuario Desconocido" 
    }, { status: 200 });

  } catch (error) {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}