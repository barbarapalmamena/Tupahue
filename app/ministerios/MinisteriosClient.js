'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./ministerios.module.css";
import { getMinisterios } from '@/lib/supabase';

export default function MinisteriosClient() {
    const [ministerios, setMinisterios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMinisterios() {
            const { data } = await getMinisterios();
            if (data && data.length > 0) {
                setMinisterios(data);
            } else {
                // Fallback a datos estáticos si no hay en la DB
                setMinisterios([
                    { id: 1, nombre: 'Familia Pastoral - Pr. Raúl Laguna y Nena García', descripcion: 'Liderazgo pastoral enfocado en el cuidado espiritual y la guía doctrinal de nuestra congregación.', encargado: 'Pr. Raúl Laguna y Nena García', categoria: 'pastoral', imagen: '/img/familia1.jpg' },
                    { id: 2, nombre: 'Anciano - Pablo Cosque', descripcion: 'Liderazgo laico comprometido con el gobierno y la sabiduría en la toma de decisiones de la iglesia.', encargado: 'Pablo Cosque', categoria: 'pastoral', imagen: '/img/familia2.jpg' },
                    { id: 3, nombre: 'Anciano - Carlos Garcés', descripcion: 'Liderazgo laico dedicado al apoyo pastoral y el fortalecimiento de la comunidad de fe.', encargado: 'Carlos Garcés', categoria: 'pastoral', imagen: '/img/familia3.jpg' },
                    { id: 4, nombre: 'Ministerio de Matrimonios', descripcion: 'Un espacio de encuentro y crecimiento espiritual para los matrimonios.', encargado: 'Pr. Raúl Laguna y Nena García', icono: 'bi-heart', categoria: 'general' },
                    { id: 5, nombre: 'Ministerio de Varones', descripcion: 'Formación bíblica y doctrinal para todas las edades.', encargado: 'Pr. Raúl Laguna', icono: 'bi-book', categoria: 'general' },
                    { id: 6, nombre: 'Ministerio de Damas', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Nena García', icono: 'bi-heart', categoria: 'general' },
                    { id: 7, nombre: 'Ministerio de Jóvenes', descripcion: 'Formación bíblica y doctrinal para todas las edades.', encargado: 'Erwin Mena y Pía Hernandez', icono: 'bi-people', categoria: 'general' },
                    { id: 8, nombre: 'Ministerio Infantil', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Nena Garcia', icono: 'bi-star', categoria: 'general' },
                    { id: 9, nombre: 'Ministerio de Alabanza', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Pablo Cosque', icono: 'bi-music-note-beamed', categoria: 'general' },
                    { id: 10, nombre: 'Ministerio de Misericordia', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Lolymar Padilla', icono: 'bi-heart-fill', categoria: 'general' },
                    { id: 11, nombre: 'Ministerio de Hospitalidad', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Lolymar Padilla', icono: 'bi-house-heart', categoria: 'general' },
                    { id: 12, nombre: 'Ministerio de Misiones y evangelismo', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'N/A', icono: 'bi-globe', categoria: 'general' },
                    { id: 13, nombre: 'Ministerio de Aseo', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Jocelin', icono: 'bi-droplet', categoria: 'general' },
                    { id: 14, nombre: 'Ministerio de Biblioteca', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Marcelo Canales', icono: 'bi-book-half', categoria: 'general' },
                    { id: 15, nombre: 'Ministerio de Audiovisual', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Marcelo Miranda', icono: 'bi-camera-video', categoria: 'general' },
                    { id: 16, nombre: 'Ministerio de Proyección', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Maria Jesus Ruíz', icono: 'bi-display', categoria: 'general' },
                    { id: 17, nombre: 'Ministerio de Redes Sociales', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Kamila Guaran y Gabrielle Natal', icono: 'bi-share', categoria: 'general' },
                    { id: 18, nombre: 'Ministerio de Tesoreria', descripcion: 'Ayuda social y apoyo comunitario, reflejando el amor de Cristo.', encargado: 'Susana Silva', icono: 'bi-cash-coin', categoria: 'general' }
                ]);
            }
            setLoading(false);
        }
        loadMinisterios();
    }, []);

    const familiasPastorales = ministerios.filter(m => m.categoria === 'pastoral');
    const otrosMinisterios = ministerios.filter(m => m.categoria !== 'pastoral');

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            {/* Banner */}
            <section
                className={styles.hero}
                style={{ backgroundImage: "url('/img/iglesia.jpg')" }}
            >
                <h1 className={styles.heroTitle}>Nuestros Ministerios</h1>
            </section>

            {/* Ministerio Pastoral */}
            <section className={styles.pastoralSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Ministerio Pastoral</h2>
                    <div className={styles.pastoralGrid}>
                        {familiasPastorales.map(familia => (
                            <div key={familia.id} className={styles.pastoralCard}>
                                <div className={styles.pastoralImageContainer}>
                                    <Image
                                        src={familia.imagen || '/img/familia1.jpg'}
                                        alt={familia.nombre}
                                        width={400}
                                        height={350}
                                        className={styles.pastoralImage}
                                    />
                                </div>
                                <div className={styles.cardBody}>
                                    <h5 className={styles.cardTitle}>{familia.nombre}</h5>
                                    <p className={styles.cardText}>{familia.descripcion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Otros Ministerios */}
            <section className={styles.ministeriosSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Otros Ministerios</h2>
                    <div className={styles.ministeriosGrid}>
                        {otrosMinisterios.map(ministerio => (
                            <div key={ministerio.id} className={styles.ministerioCard}>
                                <div className={styles.cardBody}>
                                    <i className={`bi ${ministerio.icono} ${styles.ministerioIcon}`}></i>
                                    <h5 className={styles.cardTitle}>{ministerio.nombre}</h5>
                                    <p className={styles.cardText}>{ministerio.descripcion}</p>
                                    <div className={styles.encargado}>
                                        <p className={styles.encargadoNombre}>{ministerio.encargado}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
