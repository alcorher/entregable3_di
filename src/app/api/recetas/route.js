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
      .eq("oculta", false)
      .order("fecha_creacion", { ascending: false });

    // 3. Si el usuario ha buscado algo, filtramos usando "ilike"
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

export async function POST(request) {
  try {
    const supabase = await createClient();

    // 1. Obtenemos al usuario que está logueado actualmente
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Si no hay usuario, le denegamos el acceso
    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Inicia sesión para subir recetas." },
        { status: 401 },
      );
    }

    // 2. Extraemos los datos que nos envía el formulario (incluye imagen_url)
    const { titulo, descripcion, tiempo, dificultad, ingredientes, pasos, imagen_url } =
      await request.json();

    // 3. Guardamos la receta en la base de datos
    const { error } = await supabase.from("recetas").insert([
      {
        autor_id: user.id, // Vinculamos la receta al usuario logueado
        titulo: titulo,
        descripcion: descripcion,
        tiempo: tiempo,
        dificultad: dificultad,
        // Convertimos los arrays a texto (JSON) para guardarlos en la columna 'text'
        ingredientes: JSON.stringify(ingredientes),
        pasos: JSON.stringify(pasos),
        imagen_url: imagen_url || null, // Se guarda la URL o null si está vacía
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