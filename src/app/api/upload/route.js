import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const supabase = await createClient();
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
    const fileExt = file.name.split(".").pop();
    const fileName = `${bucket === "avatars" ? "avatar" : "receta"}-${user.id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }
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
