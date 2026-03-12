import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get("busqueda");
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "16"); 
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("recetas")
      .select(`*, perfiles (nombre, avatar_url)`, { count: 'exact' })
      .eq("oculta", false) 
      .order("fecha_creacion", { ascending: false });

    if (busqueda) {
      query = query.ilike("titulo", `%${busqueda}%`);
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: data,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión para subir recetas." },
        { status: 401 },
      );
    }

    const { titulo, descripcion, tiempo, dificultad, ingredientes, pasos, imagen_url } = await request.json();

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

    // Filtrar arrays por si vienen maliciosamente vacíos
    const ingredientesValidos = Array.isArray(ingredientes) ? ingredientes.filter(i => typeof i === 'string' && i.trim() !== "") : [];
    const pasosValidos = Array.isArray(pasos) ? pasos.filter(p => typeof p === 'string' && p.trim() !== "") : [];

    if (ingredientesValidos.length === 0 || pasosValidos.length === 0) {
      return NextResponse.json({ error: "Debe haber al menos un ingrediente y un paso válido." }, { status: 400 });
    }
    // -----------------------------------

    const { error } = await supabase.from("recetas").insert([
      {
        autor_id: user.id,
        titulo: tituloLimpio,
        descripcion: descripcionLimpia,
        tiempo: tiempoLimpio,
        dificultad: dificultad,
        ingredientes: JSON.stringify(ingredientesValidos),
        pasos: JSON.stringify(pasosValidos),
        imagen_url: imagen_url || null, 
        oculta: false
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Receta creada con éxito" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}