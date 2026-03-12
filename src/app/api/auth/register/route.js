import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; 

export async function POST(request) {
  try {
    const { email, password, nombre } = await request.json();
    const supabase = await createClient(); 

    // --- NUEVO: Validación de backend ---
    const nombreLimpio = nombre?.trim() || "";
    
    if (!nombreLimpio) {
      return NextResponse.json({ error: "El nombre no puede estar en blanco." }, { status: 400 });
    }
    if (nombreLimpio.length > 30) {
      return NextResponse.json({ error: "El nombre no puede exceder los 30 caracteres." }, { status: 400 });
    }
    // -----------------------------------

    // 1. Comprobamos si el nombre ya existe
    const { data: usuarioExistente } = await supabase
      .from('perfiles')
      .select('nombre')
      .ilike('nombre', nombreLimpio) // Usamos la variable limpia
      .maybeSingle();

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Ese nombre de usuario ya está en uso. Por favor, elige otro." }, 
        { status: 400 }
      );
    }

    // 2. Registramos al usuario en Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 3. Creamos el perfil público
    if (authData.user) {
      const { error: profileError } = await supabase.from('perfiles').insert([
        {
          id: authData.user.id, 
          nombre: nombreLimpio, // Usamos la variable limpia
          sobre_mi: null,         
          avatar_url: null        
        }
      ]);

      if (profileError) {
        return NextResponse.json({ error: "Usuario registrado, pero hubo un error al crear su perfil" }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Registro exitoso", user: authData.user }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}