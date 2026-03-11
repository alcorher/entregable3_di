import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const urlUserId = searchParams.get('userId');

    // Vemos quién está haciendo la petición
    const { data: { user } } = await supabase.auth.getUser();

    let targetId = urlUserId;
    let isOwnProfile = false;
    let currentUserIsAdmin = false;

    if (!targetId) {
      if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      targetId = user.id;
      isOwnProfile = true;
    } else if (user && user.id === targetId) {
      isOwnProfile = true;
    }

    // Comprobamos si el usuario que mira la pantalla es admin
    if (user) {
      const { data: currentProfile } = await supabase
        .from("perfiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();
      
      if (currentProfile?.is_admin) currentUserIsAdmin = true;
    }

    // Buscamos los datos del perfil a mostrar
    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", targetId)
      .single();

    if (error || !perfil) return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });

    return NextResponse.json({ ...perfil, isOwnProfile, currentUserIsAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { nombre, sobre_mi } = await request.json();
    const { error } = await supabase.from("perfiles").update({ nombre, sobre_mi }).eq("id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: "Perfil actualizado correctamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}