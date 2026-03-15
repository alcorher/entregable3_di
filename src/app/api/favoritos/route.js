import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ error: "No autorizado" }, { status: 401 });

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        receta_id,
        recetas (
          *,
          perfiles (nombre)
        )
      `)
      .eq('usuario_id', user.id)
      .order('fecha_guardado', { ascending: false });

    if (error) return Response.json({ error: error.message }, { status: 400 });
    const recetasFavoritas = data.map(f => f.recetas).filter(r => r !== null);
    return Response.json(recetasFavoritas, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "No autorizado" }, { status: 401 });

    const { recetaId } = await request.json();

    const { error } = await supabase
      .from('favoritos')
      .insert([{ usuario_id: user.id, receta_id: recetaId }]);

    if (error) return Response.json({ error: error.message }, { status: 400 });
    return Response.json({ message: "Añadido a favoritos" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}