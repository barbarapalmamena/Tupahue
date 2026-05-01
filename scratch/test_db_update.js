const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
    console.log('--- INTENTANDO ACTUALIZAR IMAGEN DEL LIBRO #1 ---');
    const testUrl = 'https://iglesiatupahue.cl/test-image.jpg';
    
    const { data, error } = await supabase
        .from('libros')
        .update({ imagen_url: testUrl })
        .eq('id', 1)
        .select();

    if (error) {
        console.error('❌ ERROR AL ACTUALIZAR:', error.message);
        if (error.message.includes('policy')) {
            console.log('👉 SOSPECHA CONFIRMADA: Tienes una política de RLS que impide actualizar esta columna.');
        }
    } else {
        console.log('✅ ÉXITO: La base de datos SÍ permite actualizar la imagen.');
        console.log('Resultado:', data[0]);
    }
}

testUpdate();
