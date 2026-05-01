const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function initSiteConfig() {
    console.log('--- INICIALIZANDO CONFIGURACIÓN DEL SITIO ---');
    
    const configs = [
        { clave: 'hero_titulo', valor: 'BIENVENIDOS\nIGLESIA TUPAHUE\nREFORMADA' },
        { clave: 'mision_texto', valor: 'Somos una iglesia formada por personas que expresan la misma fe, reciben el mismo Señor, creen en su nombre y fueron llamados a ser parte de una nueva familia donde están todos aquellos que hacen la voluntad del Padre.' },
        { clave: 'video_dominical', valor: 'https://www.youtube.com/embed/videoseries?list=PLmShX6jrCSweWQtT-WZp5OwIjjP_hFKh6' },
        { clave: 'video_credo', valor: 'https://www.youtube.com/embed/jMQa-1Gk3a4?si=EN8szu3jncPMrSAL' },
        { clave: 'video_estudio', valor: 'https://www.youtube.com/embed/videoseries?list=PLmShX6jrCSwcOTbXLuwmtWHJdXPLnXI_k' },
        { clave: 'horario_miercoles', valor: 'Miércoles - 19h30 (Reunión de Oración)' },
        { clave: 'horario_domingo', valor: 'Domingo - Escuela Bíblica 10h30 / Servicio 11h20' },
        { clave: 'banner_inicio', valor: '/img/inicio.jpg' },
        { clave: 'banner_actividades', valor: '/img/actividades.jpg' }
    ];

    for (const config of configs) {
        const { error } = await supabase
            .from('configuracion')
            .upsert(config, { onConflict: 'clave' });
        
        if (error) {
            if (error.message.includes('relation "configuracion" does not exist')) {
                console.error('❌ ERROR: La tabla "configuracion" no existe. Por favor créala en el SQL Editor.');
                console.log('Comando SQL:\nCREATE TABLE configuracion (id SERIAL PRIMARY KEY, clave TEXT UNIQUE, valor TEXT, updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());');
                return;
            }
            console.error(`❌ Error en ${config.clave}:`, error.message);
        } else {
            console.log(`✅ Configurada: ${config.clave}`);
        }
    }
}

initSiteConfig();
