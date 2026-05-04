import { createClient } from '@supabase/supabase-js'

// Lazy initialization para evitar errores durante el build de Vercel
let _supabase = null;

export function getSupabaseClient() {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        console.log("Supabase URL cargada:", supabaseUrl ? "OK (configurada)" : "ERROR (FALTA)");
        console.log("Supabase Key cargada:", supabaseAnonKey ? `OK (${supabaseAnonKey.substring(0, 10)}...)` : "ERROR (FALTA)");

        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('Supabase credentials not available');
            return null;
        }
        _supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
    }
    return _supabase;
}

// Para compatibilidad con imports existentes
export const supabase = {
    get auth() { 
        const client = getSupabaseClient();
        return client ? client.auth : { 
            getUser: async () => ({ data: { user: null }, error: null }),
            signInWithPassword: async () => ({ data: null, error: { message: 'Supabase no configurado' } }),
            signOut: async () => ({ error: null })
        }; 
    },
    from(table) { 
        const client = getSupabaseClient();
        if (!client) {
            return {
                select: () => ({ order: () => Promise.resolve({ data: [], error: null }), eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
                insert: () => ({ select: () => Promise.resolve({ data: null, error: null }) }),
                update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) })
            };
        }
        return client.from(table); 
    }
};

export async function signUp(email, password, nombre) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { nombre } }
    })
    return { data, error }
}

export async function signIn(email, password, rememberMe = false) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
        options: { persistSession: rememberMe }
    })
    return { data, error }
}

export async function signOut() {
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut()
    return { error }
}

export async function getCurrentUser() {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data: { user } } = await client.auth.getUser()
    return user
}

export async function getLibros() {
    const client = getSupabaseClient();
    if (!client) return { data: [], error: null };
    const { data, error } = await client
        .from('libros')
        .select('*')
        .order('titulo')
    return { data, error }
}

export async function reservarLibro(libroId) {
    const client = getSupabaseClient();
    
    // 1. Obtener usuario de la sesión (Seguridad: no confiar en el ID pasado desde el cliente)
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: null, error: { message: 'Inicia sesión para reservar' } };
    const userId = user.id;
    
    // 2. Verificar si el usuario ya tiene una reserva activa
    const { data: reservasActivas } = await client
        .from('reservas')
        .select('id')
        .eq('user_id', userId)
        .eq('estado', 'activa')
        .limit(1);

    if (reservasActivas && reservasActivas.length > 0) {
        return { data: null, error: { message: 'Ya tienes una reserva activa. Debes devolver tu libro actual antes de pedir otro.' } };
    }

    // 2. Obtener datos del libro
    const { data: libro } = await client
        .from('libros')
        .select('cantidad, paginas')
        .eq('id', libroId)
        .single()

    if (!libro || libro.cantidad <= 0) {
        return { data: null, error: { message: 'No quedan ejemplares disponibles de este libro' } }
    }

    const diasPrestamo = (libro.paginas && libro.paginas < 100) ? 3 : 14;
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + diasPrestamo);

    const { data, error } = await client
        .from('reservas')
        .insert([{ 
            libro_id: libroId, 
            user_id: userId, 
            estado: 'activa',
            vencimiento: fechaVencimiento.toISOString()
        }])
        .select()

    if (!error) {
        // Decrementar cantidad disponible
        await client.from('libros').update({ 
            cantidad: libro.cantidad - 1,
            disponible: (libro.cantidad - 1) > 0 
        }).eq('id', libroId)
    }
    return { data, error }
}

export async function getReservasUsuario(userId) {
    const client = getSupabaseClient();
    const { data, error } = await client
        .from('reservas')
        .select(`*, libros (titulo, autor, categoria, paginas)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    return { data, error }
}

export async function devolverLibro(reservaId, libroId) {
    const client = getSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { data: null, error: { message: 'No autorizado' } };

    const { data, error } = await client
        .from('reservas')
        .update({ estado: 'devuelto', fecha_devolucion: new Date().toISOString() })
        .eq('id', reservaId)

    if (!error && libroId) {
        // Obtener cantidad actual
        const { data: libro } = await client.from('libros').select('cantidad').eq('id', libroId).single();
        // Incrementar cantidad
        await client.from('libros').update({ 
            cantidad: (libro?.cantidad || 0) + 1,
            disponible: true 
        }).eq('id', libroId)
    }
    return { data, error }
}

export async function eliminarReserva(reservaId, libroId) {
    const client = getSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    if (!user) return { error: { message: 'No autorizado' } };
    
    const { error } = await client
        .from('reservas')
        .delete()
        .eq('id', reservaId);

    if (!error && libroId) {
        const { data: libro } = await client.from('libros').select('cantidad').eq('id', libroId).single();
        await client.from('libros').update({ 
            cantidad: (libro?.cantidad || 0) + 1,
            disponible: true 
        }).eq('id', libroId);
    }
    
    return { error };
}

// ===== GESTIÓN DE LIBROS (ADMIN) =====

export async function crearLibro(libro) {
    const client = getSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    const dbRole = user ? await getUserRole(user.id) : null;
    const isAdmin = dbRole === 'admin' || user?.user_metadata?.role === 'admin';
    if (!isAdmin) return { error: { message: 'No autorizado' } };

    const { data, error } = await client
        .from('libros')
        .insert([libro])
        .select();
    return { data, error };
}

export async function actualizarLibro(id, cambios) {
    const client = getSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    const dbRole = user ? await getUserRole(user.id) : null;
    const isAdmin = dbRole === 'admin' || user?.user_metadata?.role === 'admin';
    if (!isAdmin) return { error: { message: 'No autorizado' } };

    const { data, error } = await client
        .from('libros')
        .update(cambios)
        .eq('id', id)
        .select();
    return { data, error };
}

export async function eliminarLibro(id) {
    const client = getSupabaseClient();
    const { data: { user } } = await client.auth.getUser();
    
    // Verificar rol (Base de datos o Metadata)
    const dbRole = user ? await getUserRole(user.id) : null;
    const isAdmin = dbRole === 'admin' || user?.user_metadata?.role === 'admin';
    
    if (!isAdmin) return { error: { message: 'No autorizado' } };

    // 1. Primero eliminar las reservas asociadas para evitar error de llave foránea (Foreign Key Constraint)
    // Esto es necesario si la base de datos no tiene configurado ON DELETE CASCADE
    const { error: errorReservas } = await client
        .from('reservas')
        .delete()
        .eq('libro_id', id);

    if (errorReservas) {
        console.error("Error al eliminar reservas asociadas:", errorReservas);
        // Continuamos de todos modos, tal vez no hay reservas o falló algo no crítico
    }

    // 2. Ahora eliminar el libro
    const { error } = await client
        .from('libros')
        .delete()
        .eq('id', id);
        
    return { error };
}

export async function getUserRole(userId) {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client
        .from('usuarios')
        .select('rol')
        .eq('id', userId)
        .single();
    
    if (error) return null;
    return data?.rol;
}

// ===== ARTÍCULOS / PALABRA =====

export async function getArticulos() {
    const client = getSupabaseClient();
    if (!client) return { data: [], error: null };
    const { data, error } = await client
        .from('articulos')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
}

export async function crearArticulo(articulo) {
    const client = getSupabaseClient();
    if (!client) return { error: { message: 'Client not ready' } };
    
    // Verificar Admin (Seguridad extra)
    const { data: { user } } = await client.auth.getUser();
    const dbRole = user ? await getUserRole(user.id) : null;
    const isAdmin = dbRole === 'admin' || user?.user_metadata?.role === 'admin';
    if (!isAdmin) return { error: { message: 'No autorizado' } };

    const { data, error } = await client
        .from('articulos')
        .insert([articulo])
        .select();
    return { data, error };
}

export async function eliminarArticulo(id) {
    const client = getSupabaseClient();
    if (!client) return { error: { message: 'Client not ready' } };
    
    // Verificar Admin
    const { data: { user } } = await client.auth.getUser();
    const dbRole = user ? await getUserRole(user.id) : null;
    const isAdmin = dbRole === 'admin' || user?.user_metadata?.role === 'admin';
    if (!isAdmin) return { error: { message: 'No autorizado' } };

    const { error } = await client
        .from('articulos')
        .delete()
        .eq('id', id);
    return { error };
}

export async function actualizarArticulo(id, cambios) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: { message: 'Client not ready' } };
    
    // Verificar Admin
    const { data: { user } } = await client.auth.getUser();
    const dbRole = user ? await getUserRole(user.id) : null;
    const isAdmin = dbRole === 'admin' || user?.user_metadata?.role === 'admin';
    if (!isAdmin) return { error: { message: 'No autorizado' } };

    const { data, error } = await client
        .from('articulos')
        .update(cambios)
        .eq('id', id)
        .select();
    return { data, error };
}

export async function recuperarPassword(email) {
    const client = getSupabaseClient();
    if (!client) return { error: { message: 'Supabase no configurado' } };
    
    // Obtenemos la URL base actual para el redireccionamiento
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/cambiar-password`,
    });
    return { data, error };
}

export async function actualizarPassword(newPassword) {
    const client = getSupabaseClient();
    if (!client) return { error: { message: 'Supabase no configurado' } };
    
    const { data, error } = await client.auth.updateUser({
        password: newPassword
    });
    return { data, error };
}
