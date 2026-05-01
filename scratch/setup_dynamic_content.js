const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDynamicContent() {
    console.log('--- CONFIGURANDO CONTENIDO DINÁMICO ---');

    // 1. Crear configuración inicial (Inicio y Nosotros)
    const configs = [
        { clave: 'inicio_hero_titulo', valor: 'BIENVENIDOS\nIGLESIA TUPAHUE\nREFORMADA' },
        { clave: 'inicio_mision_resumen', valor: 'Somos una iglesia formada por personas que expresan la misma fe, reciben el mismo Señor, creen en su nombre y fueron llamados a ser parte de una nueva familia donde están todos aquellos que hacen la voluntad del Padre.' },
        { clave: 'nosotros_quienes_somos', valor: 'Personas que expresan la misma fe, reciben el mismo Señor, creen en su nombre y fueron llamadas a hacer parte de La Iglesia Universal donde están todos aquellos que hacen la voluntad del Padre.' },
        { clave: 'nosotros_vision', valor: 'Ser una iglesia compuesta por discípulos diversos que orientan integralmente su vida de acuerdo con el evangelio buscando hacer el verdadero Jesús conocido en Puerto Montt y alrededor del mundo para la gloria de Dios' },
        { clave: 'nosotros_mision', valor: 'La iglesia Tupahue existe para anunciar el evangelio en Puerto Montt y hasta el fin de la tierra, uniéndonos a Dios en su propósito de hacer nuevas todas las cosas a través de la persona y obra de Jesús...' },
        { clave: 'video_dominical', valor: 'https://www.youtube.com/embed/videoseries?list=PLmShX6jrCSweWQtT-WZp5OwIjjP_hFKh6' },
        { clave: 'video_credo', valor: 'https://www.youtube.com/embed/jMQa-1Gk3a4?si=EN8szu3jncPMrSAL' },
        { clave: 'video_estudio', valor: 'https://www.youtube.com/embed/videoseries?list=PLmShX6jrCSwcOTbXLuwmtWHJdXPLnXI_k' }
    ];

    console.log('Sembrando configuración...');
    for (const c of configs) {
        await supabase.from('configuracion').upsert(c);
    }

    // 2. Sembrar Ministerios
    const ministerios = [
        { nombre: 'Familia Pastoral', descripcion: 'Liderazgo pastoral enfocado en el cuidado espiritual...', encargado: 'Pr. Raul y Nena', categoria: 'pastoral', imagen: '/img/familia1.jpg' },
        { nombre: 'Ministerio de Matrimonios', descripcion: 'Un espacio de encuentro y crecimiento espiritual...', encargado: 'Pr. Raul y Nena', icono: 'bi-heart' },
        { nombre: 'Ministerio de Varones', descripcion: 'Formación bíblica y doctrinal...', encargado: 'Rafael Guaran', icono: 'bi-book' },
        { nombre: 'Ministerio de Damas', descripcion: 'Ayuda social y apoyo comunitario...', encargado: 'Nena', icono: 'bi-heart' },
        { nombre: 'Ministerio de Jóvenes', descripcion: 'Formación bíblica y doctrinal...', encargado: 'Carlos y Maria Jesus', icono: 'bi-people' }
        // ... (se pueden añadir más)
    ];

    console.log('Sembrando ministerios...');
    for (const m of ministerios) {
        await supabase.from('ministerios').upsert(m, { onConflict: 'nombre' });
    }

    console.log('✅ Proceso completado.');
}

setupDynamicContent();
