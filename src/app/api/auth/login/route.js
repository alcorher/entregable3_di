import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const supabase = await createClient();

    // 1. Intentamos iniciar sesión con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Devolvemos el mensaje de error real de Supabase (ej. contraseña incorrecta)
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2. Si el login es correcto, verificamos si el usuario está bloqueado en nuestra tabla
    if (data.user) {
      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('bloqueado')
        .eq('id', data.user.id)
        .single();

      if (perfilError) {
        // Por seguridad, si falla la consulta del perfil, cerramos la sesión
        await supabase.auth.signOut();
        return NextResponse.json({ error: "Error al verificar el estado de la cuenta." }, { status: 500 });
      }

      // 3. Si el usuario está bloqueado, cerramos la sesión y bloqueamos el acceso
      if (perfil?.bloqueado) {
        await supabase.auth.signOut(); // ¡CRUCIAL! Cerramos la sesión que se acababa de abrir
        return NextResponse.json(
          { error: "Tu cuenta ha sido bloqueada por un administrador. No puedes iniciar sesión." }, 
          { status: 403 }
        );
      }
    }

    // Si todo está bien, permitimos el acceso
    return NextResponse.json({ message: "Login exitoso", user: data.user }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}