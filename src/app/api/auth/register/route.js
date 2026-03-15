import { createClient } from '@/utils/supabase/server'; 

export async function POST(request) {
  try {
    const { email, password, nombre } = await request.json();
    const supabase = await createClient(); 
    const nombreLimpio = nombre?.trim() || "";
    
    if (!nombreLimpio) {
      return Response.json({ error: "El nombre no puede estar en blanco." }, { status: 400 });
    }
    if (nombreLimpio.length > 30) {
      return Response.json({ error: "El nombre no puede exceder los 30 caracteres." }, { status: 400 });
    }
    const { data: usuarioExistente } = await supabase
      .from('perfiles')
      .select('nombre')
      .ilike('nombre', nombreLimpio)
      .maybeSingle();

    if (usuarioExistente) {
      return Response.json(
        { error: "Ese nombre de usuario ya está en uso. Por favor, elige otro." }, 
        { status: 400 }
      );
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return Response.json({ error: authError.message }, { status: 400 });
    }
    if (authData.user) {
      const { error: profileError } = await supabase.from('perfiles').insert([
        {
          id: authData.user.id, 
          nombre: nombreLimpio,
          sobre_mi: null,         
          avatar_url: null        
        }
      ]);

      if (profileError) {
        return Response.json({ error: "Usuario registrado, pero hubo un error al crear su perfil" }, { status: 500 });
      }
    }

    return Response.json({ message: "Registro exitoso", user: authData.user }, { status: 200 });
    
  } catch (error) {
    return Response.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}