import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const recetaId = resolvedParams.id;
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', user.id)
      .eq('receta_id', recetaId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ message: "Eliminado" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}