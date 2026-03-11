import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// NUEVO: Método GET para obtener las recetas públicas para el Home
export async function GET() {
  try {
    const supabase = await createClient();

    // Obtenemos las últimas 20 recetas junto con los datos del autor
    const { data, error } = await supabase
      .from("recetas")
      .select(`*, perfiles (nombre, avatar_url)`)
      .order("fecha_creacion", { ascending: false })
      .limit(20);

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

    // 2. Extraemos los datos que nos envía el formulario
    const { titulo, descripcion, tiempo, dificultad, ingredientes, pasos } =
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
        imagen_url: null, // Por ahora dejamos la imagen vacía
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
