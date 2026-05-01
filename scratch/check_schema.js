const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- INSPECCIONANDO TABLA LIBROS ---');
    const { data, error } = await supabase.from('libros').select('*').limit(1);
    
    if (error) {
        console.error('Error al conectar:', error.message);
        return;
    }

    if (data && data.length > 0) {
        console.log('Columnas encontradas:', Object.keys(data[0]));
        console.log('Contenido del primer libro:', data[0]);
    } else {
        console.log('La tabla está vacía. Intentando obtener nombres de columnas por error provocado...');
        const { error: error2 } = await supabase.from('libros').select('columna_inexistente_de_prueba');
        console.log('Mensaje de error (contiene pistas):', error2.message);
    }
}

checkSchema();
