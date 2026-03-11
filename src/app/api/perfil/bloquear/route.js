import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request) {
  try {
    const supabase = await createClient();
    
    // 1. Vemos quién está haciendo la petición
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // 2. Comprobamos si es admin
    const { data: adminProfile } = await supabase
      .from("perfiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ error: "No tienes permisos de administrador" }, { status: 403 });
    }

    // 3. Obtenemos a quién queremos bloquear/desbloquear
    const { targetUserId, bloqueado } = await request.json();

    const { error } = await supabase
      .from("perfiles")
      .update({ bloqueado: bloqueado })
      .eq("id", targetUserId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: "Operación exitosa" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}