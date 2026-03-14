import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request, { params }) {
  try {
    // IMPORTANTE: En Next 16 usamos await params
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    if (!userId) {
      return NextResponse.json({ error: "Falta el ID del usuario en la URL" }, { status: 400 });
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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      recetas, 
      username: perfil?.nombre || "Usuario Desconocido" 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}