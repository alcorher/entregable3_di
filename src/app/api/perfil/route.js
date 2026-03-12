import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    const { searchParams } = new URL(request.url);
    const userIdUrl = searchParams.get('userId');
    const targetUserId = userIdUrl || user?.id;

    if (!targetUserId) {
      return NextResponse.json({ error: "No autorizado o ID no proporcionado" }, { status: 401 });
    }

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", targetUserId)
      .single();

    if (error) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, sobre_mi, avatar_url } = await request.json();
    const nombreLimpio = nombre?.trim() || "";
    const sobreMiLimpio = sobre_mi?.trim() || null;

    if (!nombreLimpio) {
      return NextResponse.json({ error: "El nombre no puede estar en blanco." }, { status: 400 });
    }
    if (nombreLimpio.length > 30) {
      return NextResponse.json({ error: "El nombre no puede exceder los 30 caracteres." }, { status: 400 });
    }
    if (sobreMiLimpio && sobreMiLimpio.length > 300) {
      return NextResponse.json({ error: "La sección 'Sobre mí' no puede exceder los 300 caracteres." }, { status: 400 });
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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Perfil actualizado correctamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}