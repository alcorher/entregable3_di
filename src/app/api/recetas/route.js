import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get("busqueda");
    
    // NUEVO: Leer los parámetros de paginación de la URL
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "16"); // 16 recetas por página
    
    // Calculamos desde qué elemento hasta qué elemento debemos buscar
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // NUEVO: { count: 'exact' } le dice a Supabase que nos diga cuántas hay en total
    let query = supabase
      .from("recetas")
      .select(`*, perfiles (nombre, avatar_url)`, { count: 'exact' })
      .eq("oculta", false) // Filtro de ocultas
      .order("fecha_creacion", { ascending: false });

    // Si el usuario ha buscado algo
    if (busqueda) {
      query = query.ilike("titulo", `%${busqueda}%`);
    }

    // NUEVO: Aplicamos la paginación a la consulta
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // NUEVO: Devolvemos un objeto con los datos y el número total de páginas
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

    const { titulo, descripcion, tiempo, dificultad, ingredientes, pasos, imagen_url } =
      await request.json();

    const { error } = await supabase.from("recetas").insert([
      {
        autor_id: user.id,
        titulo: titulo,
        descripcion: descripcion,
        tiempo: tiempo,
        dificultad: dificultad,
        ingredientes: JSON.stringify(ingredientes),
        pasos: JSON.stringify(pasos),
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