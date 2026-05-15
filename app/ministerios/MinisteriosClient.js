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
                    { id: 1, nombre: 'Familia Pastoral - Pr. Raúl Laguna y Nena García', descripcion: 'Pon algo aquí', encargado: 'Pr. Raúl Laguna y Nena García', categoria: 'pastoral', imagen: '/img/familia1.jpg' },
                    { id: 2, nombre: 'Anciano - Pablo Cosque', descripcion: 'Pon algo aquí', encargado: 'Pablo Cosque', categoria: 'pastoral', imagen: '/img/familia2.jpg' },
                    { id: 3, nombre: 'Anciano - Carlos Garcés', descripcion: 'Pon algo aquí', encargado: 'Carlos Garcés', categoria: 'pastoral', imagen: '/img/familia3.jpg' },
                    { id: 4, nombre: 'Ministerio de Matrimonios', descripcion: 'Pon algo aquí', encargado: 'Pr. Raúl Laguna y Nena García', categoria: 'general' },
                    { id: 5, nombre: 'Ministerio de Varones', descripcion: 'Pon algo aquí', encargado: 'Pr. Raúl Laguna', categoria: 'general' },
                    { id: 6, nombre: 'Ministerio de Damas', descripcion: 'Pon algo aquí', encargado: 'Nena García', categoria: 'general' },
                    { id: 7, nombre: 'Ministerio de Jóvenes', descripcion: 'Pon algo aquí', encargado: 'Erwin Mena y Pía Hernandez', categoria: 'general' },
                    { id: 8, nombre: 'Ministerio Infantil', descripcion: 'Pon algo aquí', encargado: 'Nena Garcia', categoria: 'general' },
                    { id: 9, nombre: 'Ministerio de Alabanza', descripcion: 'Pon algo aquí', encargado: 'Pablo Cosque', categoria: 'general' },
                    { id: 10, nombre: 'Ministerio de Misericordia', descripcion: 'Pon algo aquí', encargado: 'Lolymar Padilla', categoria: 'general' },
                    { id: 11, nombre: 'Ministerio de Hospitalidad', descripcion: 'Pon algo aquí', encargado: 'Lolymar Padilla', categoria: 'general' },
                    { id: 12, nombre: 'Ministerio de Misiones y evangelismo', descripcion: 'Pon algo aquí', encargado: 'N/A', categoria: 'general' },
                    { id: 13, nombre: 'Ministerio de Aseo', descripcion: 'Pon algo aquí', encargado: 'Jocelin', categoria: 'general' },
                    { id: 14, nombre: 'Ministerio de Biblioteca', descripcion: 'Pon algo aquí', encargado: 'Marcelo Canales', categoria: 'general' },
                    { id: 15, nombre: 'Ministerio de Audiovisual', descripcion: 'Pon algo aquí', encargado: 'Marcelo Miranda', categoria: 'general' },
                    { id: 16, nombre: 'Ministerio de Proyección', descripcion: 'Pon algo aquí', encargado: 'Maria Jesus Ruíz', categoria: 'general' },
                    { id: 17, nombre: 'Ministerio de Redes Sociales', descripcion: 'Pon algo aquí', encargado: 'Kamila Guaran y Gabrielle Natal', categoria: 'general' },
                    { id: 18, nombre: 'Ministerio de Tesoreria', descripcion: 'Pon algo aquí', encargado: 'Susana Silva', categoria: 'general' }
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
                                    <div className={styles.ministerioImageContainer}>
                                        <Image
                                            src={ministerio.imagen || '/img/iglesia.jpg'}
                                            alt={ministerio.nombre}
                                            width={300}
                                            height={200}
                                            className={styles.ministerioImage}
                                        />
                                    </div>
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
