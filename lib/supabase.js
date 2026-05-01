import { createClient } from '@supabase/supabase-js'

// Lazy initialization para evitar errores durante el build de Vercel
let _supabase = null;

export function getSupabaseClient() {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

export async function reservarLibro(libroId, userId) {
    const client = getSupabaseClient();
    const { data: libro } = await client
        .from('libros')
        .select('disponible')
        .eq('id', libroId)
        .single()

    if (!libro?.disponible) {
        return { data: null, error: { message: 'El libro no está disponible' } }
    }

    const { data, error } = await client
        .from('reservas')
        .insert([{ libro_id: libroId, user_id: userId, estado: 'activa' }])
        .select()

    if (!error) {
        await client.from('libros').update({ disponible: false }).eq('id', libroId)
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
    const { data, error } = await client
        .from('reservas')
        .update({ estado: 'devuelto', fecha_devolucion: new Date().toISOString() })
        .eq('id', reservaId)

    if (!error) {
        await client.from('libros').update({ disponible: true }).eq('id', libroId)
    }
    return { data, error }
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
