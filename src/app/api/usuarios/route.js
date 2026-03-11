import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; //

export async function GET(request) {
  try {
    const supabase = await createClient(); //

    // Obtenemos los parámetros de búsqueda de la URL
    const { searchParams } = new URL(request.url);
    const busqueda = searchParams.get("busqueda");

    // Consulta base a la tabla perfiles
    let query = supabase
      .from("perfiles")
      .select("id, nombre, avatar_url, sobre_mi");

    // Aplicamos el filtro si existe búsqueda
    if (busqueda) {
      query = query.ilike("nombre", `%${busqueda}%`);
    } else {
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
      { status: 500 }
    );
  }
}