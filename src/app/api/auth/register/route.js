import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; 

export async function POST(request) {
  try {
    const { email, password, nombre } = await request.json();
    const supabase = await createClient(); 

    // 1. Registramos al usuario en Supabase (auth.users)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 2. Creamos el perfil público en nuestra tabla "perfiles"
    if (authData.user) {
      const { error: profileError } = await supabase.from('perfiles').insert([
        {
          id: authData.user.id, 
          nombre: nombre,
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