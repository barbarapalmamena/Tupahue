'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./ministerios.module.css";

export default function MinisteriosClient() {
    const [ministerios, setMinisterios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMinisterios();
    }, []);

    const fetchMinisterios = async () => {
        setLoading(true);
        try {
            const { data } = await supabase.from('ministerios').select('*').order('id');
            setMinisterios(data || []);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const familiasPastorales = ministerios.filter(m => m.categoria === 'pastoral');
    const otrosMinisterios = ministerios.filter(m => m.categoria !== 'pastoral');

    return (
        <div className={styles.pageContainer}>
            {/* Navbar */}
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
                                        src={familia.imagen}
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

            {/* Footer */}
            <Footer />
        </div>
    );
}
