import { createClient } from '@/utils/supabase/server';

export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient();
    const parametros = await params;
    const recetaId = parametros.id;
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ error: "No autorizado" }, { status: 401 });

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('usuario_id', user.id)
      .eq('receta_id', recetaId);

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ message: "Eliminado" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}