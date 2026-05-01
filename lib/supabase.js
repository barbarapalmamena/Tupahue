import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

export async function signUp(email, password, nombre) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nombre: nombre,
            }
        }
    })
    return { data, error }
}

export async function signIn(email, password, rememberMe = false) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
            persistSession: rememberMe
        }
    })
    return { data, error }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function getLibros() {
    const { data, error } = await supabase
        .from('libros')
        .select('*')
        .order('titulo')
    return { data, error }
}

export async function reservarLibro(libroId, userId) {
    const { data: libro } = await supabase
        .from('libros')
        .select('disponible')
        .eq('id', libroId)
        .single()

    if (!libro?.disponible) {
        return { data: null, error: { message: 'El libro no está disponible' } }
    }

    const { data, error } = await supabase
        .from('reservas')
        .insert([
            { libro_id: libroId, user_id: userId, estado: 'activa' }
        ])
        .select()

    if (!error) {
        await supabase
            .from('libros')
            .update({ disponible: false })
            .eq('id', libroId)
    }

    return { data, error }
}

export async function getReservasUsuario(userId) {
    const { data, error } = await supabase
        .from('reservas')
        .select(`
      *,
      libros (
        titulo,
        autor,
        categoria,
        paginas
      )
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    return { data, error }
}

export async function devolverLibro(reservaId, libroId) {
    const { data, error } = await supabase
        .from('reservas')
        .update({
            estado: 'devuelto',
            fecha_devolucion: new Date().toISOString()
        })
        .eq('id', reservaId)

    if (!error) {
        await supabase
            .from('libros')
            .update({ disponible: true })
            .eq('id', libroId)
    }

    return { data, error }
}
