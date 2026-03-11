import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const supabase = await createClient();

    // 1. Obtenemos los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get("busqueda");

    // 2. Preparamos la consulta base
    let query = supabase
      .from("recetas")
      .select(`*, perfiles (nombre, avatar_url)`)
      .order("fecha_creacion", { ascending: false });

    // 3. Si el usuario ha buscado algo, filtramos usando "ilike"
    // NOTA: Asegúrate de que la columna se llama "titulo" en tu base de datos
    if (busqueda) {
      query = query.ilike("titulo", `%${busqueda}%`);
    } else {
      // Si no hay búsqueda, traemos solo las últimas 20 por defecto
      query = query.limit(20);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// El método POST se queda exactamente igual que lo tenías
export async function POST(request) {
  // ... tu código actual de POST ...
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