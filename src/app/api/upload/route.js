import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const supabase = await createClient();

    // 1. Verificamos usuario autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado para subir archivos" },
        { status: 401 },
      );
    }

    // 2. Leemos el FormData enviado desde el cliente
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket");
    const oldFileName = formData.get("oldFileName");

    if (!file || !bucket) {
      return NextResponse.json(
        { error: "Faltan parámetros (archivo o bucket)" },
        { status: 400 },
      );
    }

    // 3. Validaciones de Seguridad del Archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen válida." },
        { status: 400 },
      );
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande. El máximo es 5MB." },
        { status: 400 },
      );
    }

    // 4. Si hay una imagen antigua, la borramos para ahorrar espacio
    if (oldFileName && oldFileName !== "null" && oldFileName !== "") {
      const { error: removeError } = await supabase.storage
        .from(bucket)
        .remove([oldFileName]);
      if (removeError) {
        console.error(
          "No se pudo eliminar la imagen antigua:",
          removeError.message,
        );
      }
    }

    // 5. Generar un nombre único y seguro
    const fileExt = file.name.split(".").pop();
    const fileName = `${bucket === "avatars" ? "avatar" : "receta"}-${user.id}-${Date.now()}.${fileExt}`;

    // 6. Subir el archivo al bucket de Supabase (SIN UPSERT)
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    // 7. Obtener y devolver la URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Error crítico en API Upload:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
