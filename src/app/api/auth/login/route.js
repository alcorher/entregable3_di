import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      const { data: perfil, error: perfilError } = await supabase
        .from("perfiles")
        .select("bloqueado")
        .eq("id", data.user.id)
        .single();

      if (perfilError) {
        await supabase.auth.signOut();
        return NextResponse.json(
          { error: "Error al verificar el estado de la cuenta." },
          { status: 500 },
        );
      }

      if (perfil?.bloqueado) {
        await supabase.auth.signOut();
        return NextResponse.json(
          {
            error:
              "Tu cuenta ha sido bloqueada por un administrador. No puedes iniciar sesión.",
          },
          { status: 403 },
        );
      }
    }

    
    return NextResponse.json(
      { message: "Login exitoso", user: data.user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
