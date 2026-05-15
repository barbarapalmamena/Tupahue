const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ministeriosCompletos = [
    // PASTORAL
    { nombre: 'Familia Pastoral - Pr. Raúl Laguna y Nena García', descripcion: 'Liderazgo pastoral enfocado en el cuidado espiritual y la guía doctrinal de nuestra congregación.', encargado: 'Pr. Raúl Laguna y Nena García', categoria: 'pastoral', imagen: '/img/familia1.jpg' },
    { nombre: 'Anciano - Pablo Cosque', descripcion: 'Liderazgo laico comprometido con el gobierno y la sabiduría en la toma de decisiones de la iglesia.', encargado: 'Pablo Cosque', categoria: 'pastoral', imagen: '/img/familia2.jpg' },
    { nombre: 'Anciano - Carlos Garcés', descripcion: 'Liderazgo laico dedicado al apoyo pastoral y el fortalecimiento de la comunidad de fe.', encargado: 'Carlos Garcés', categoria: 'pastoral', imagen: '/img/familia3.jpg' },
    
    // OTROS
    { nombre: 'Ministerio de Matrimonios', descripcion: 'Un espacio de encuentro y crecimiento espiritual para los matrimonios.', encargado: 'Pr. Raul y Nena', icono: 'bi-heart', categoria: 'general' },
    { nombre: 'Ministerio de Varones', descripcion: 'Formación bíblica y doctrinal para todas las edades.', encargado: 'Rafael Guaran', icono: 'bi-book', categoria: 'general' },
    { nombre: 'Ministerio de Damas', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Nena', icono: 'bi-heart', categoria: 'general' },
    { nombre: 'Ministerio de Jóvenes', descripcion: 'Formación bíblica y doctrinal para todas las edades.', encargado: 'Carlos y Maria Jesus', icono: 'bi-people', categoria: 'general' },
    { nombre: 'Ministerio Infantil', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Nena', icono: 'bi-star', categoria: 'general' },
    { nombre: 'Ministerio de Alabanza', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Pablo Cosque', icono: 'bi-music-note-beamed', categoria: 'general' },
    { nombre: 'Ministerio de Misericordia', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Lolymar Padilla', icono: 'bi-heart-fill', categoria: 'general' },
    { nombre: 'Ministerio de Hospitalidad', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Lolymar Padilla', icono: 'bi-house-heart', categoria: 'general' },
    { nombre: 'Ministerio de Misiones y evangelismo', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Rodrigo Cardenas', icono: 'bi-globe', categoria: 'general' },
    { nombre: 'Ministerio de Aseo', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Jocelin', icono: 'bi-droplet', categoria: 'general' },
    { nombre: 'Ministerio de Biblioteca', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Carolina Santibañez', icono: 'bi-book-half', categoria: 'general' },
    { nombre: 'Ministerio de Audiovisual', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Marcelo', icono: 'bi-camera-video', categoria: 'general' },
    { nombre: 'Ministerio de Proyección', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Maria Jesus Ruíz', icono: 'bi-display', categoria: 'general' },
    { nombre: 'Ministerio de Redes Sociales', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Kamila Guaran y Gabrielle Natal', icono: 'bi-share', categoria: 'general' },
    { nombre: 'Ministerio de Tesoreria', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Susana Silva', icono: 'bi-cash-coin', categoria: 'general' }
];

async function updateAll() {
    console.log('Limpiando y actualizando ministerios...');
    
    // 1. Borrar actuales
    await supabase.from('ministerios').delete().neq('id', 0);
    
    // 2. Insertar nuevos
    const { data, error } = await supabase.from('ministerios').insert(ministeriosCompletos);
    
    if (error) console.error('Error:', error);
    else console.log('Successfully updated all ministerios');
}

updateAll();
