'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./page.module.css";
import { getCurrentUser, signOut, getArticulos, supabase } from '@/lib/supabase';

export default function HomeClient() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [articulos, setArticulos] = useState([]);
    const [loadingArticulos, setLoadingArticulos] = useState(true);
    const [config, setConfig] = useState({});

    useEffect(() => {
        loadUser();
        fetchArticulos();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        const { data } = await supabase.from('configuracion').select('*');
        const configMap = {};
        data?.forEach(item => { configMap[item.clave] = item.valor; });
        setConfig(configMap);
    };

    const loadUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
    };

    const fetchArticulos = async () => {
        try {
            const { data, error } = await getArticulos();
            if (error) throw error;
            setArticulos(data || []);
        } catch (error) {
            console.error('Error loading articulos:', error);
        } finally {
            setLoadingArticulos(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        router.push('/');
    };

    return (
        <div className={styles.pageContainer}>
            {/* Navbar */}
            <Navbar user={user} onLogout={handleLogout} />

            {/* Hero */}
            <section
                className={styles.hero}
                style={{ backgroundImage: "url('/img/inicio.jpg')" }}
            >
                <div>
                    <h1 className={styles.heroTitle} style={{ whiteSpace: 'pre-line' }}>
                        {config.inicio_hero_titulo || 'BIENVENIDOS\nIGLESIA TUPAHUE\nREFORMADA'}
                    </h1>
                </div>
            </section>

            {/* Misión y Visión */}
            <section className={`${styles.misionVision} ${styles.bgBlue}`}>
                <div className={styles.container}>
                    <h2 className={styles.misionText}>
                        {config.inicio_mision_resumen || 'Somos una iglesia formada por personas que expresan la misma fe, reciben el mismo Señor, creen en su nombre y fueron llamados a ser parte de una nueva familia donde están todos aquellos que hacen la voluntad del Padre.'}
                    </h2>
                </div>
            </section>

            {/* Videos */}
            <section className={styles.videosSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
                    <div className={styles.videosGrid}>
                        {/* Video 1 - Servicio Dominical */}
                        <div className={styles.videoCard}>
                            <div className={styles.videoContainer}>
                                <iframe
                                    src={config.video_dominical || "https://www.youtube.com/embed/videoseries?list=PLmShX6jrCSweWQtT-WZp5OwIjjP_hFKh6"}
                                    allowFullScreen
                                    title="Servicio Dominical"
                                />
                            </div>
                            <div className={styles.cardBody}>
                                <h5 className={styles.cardTitle}>Servicio Dominical</h5>
                            </div>
                        </div>

                        {/* Video 2 - El Credo */}
                        <div className={styles.videoCard}>
                            <div className={styles.videoContainer}>
                                <iframe
                                    src={config.video_credo || "https://www.youtube.com/embed/jMQa-1Gk3a4?si=EN8szu3jncPMrSAL"}
                                    allowFullScreen
                                    title="El credo"
                                />
                            </div>
                            <div className={styles.cardBody}>
                                <h5 className={styles.cardTitle}>El credo</h5>
                            </div>
                        </div>

                        {/* Video 3 - Estudio Bíblico */}
                        <div className={styles.videoCard}>
                            <div className={styles.videoContainer}>
                                <iframe
                                    src={config.video_estudio || "https://www.youtube.com/embed/videoseries?list=PLmShX6jrCSwcOTbXLuwmtWHJdXPLnXI_k"}
                                    allowFullScreen
                                    title="Estudio Bíblico"
                                />
                            </div>
                            <div className={styles.cardBody}>
                                <h5 className={styles.cardTitle}>Estudio Bíblico</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Encuentros */}
            <section className={styles.encuentrosSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Encuentros</h2>
                    <div className={styles.encuentrosGrid}>
                        {/* Encuentro 1 */}
                        <div className={styles.encuentroCard}>
                            <div className={styles.encuentroImageContainer}>
                                <Image
                                    src="/img/oracion.jpeg"
                                    alt="Reunión de Oración"
                                    width={400}
                                    height={300}
                                    className={styles.encuentroImage}
                                />
                            </div>
                            <div className={styles.cardBody} style={{ whiteSpace: 'pre-line' }}>
                                <p className={styles.cardText}>{config.horario_miercoles || 'Miércoles - 19h30'}</p>
                            </div>
                        </div>

                        {/* Encuentro 2 */}
                        <div className={styles.encuentroCard}>
                            <div className={styles.encuentroImageContainer}>
                                <Image
                                    src="/img/servicio.jpeg"
                                    alt="Servicio Dominical"
                                    width={400}
                                    height={300}
                                    className={styles.encuentroImage}
                                />
                            </div>
                            <div className={styles.cardBody} style={{ whiteSpace: 'pre-line' }}>
                                <p className={styles.cardText}>{config.horario_domingo || 'Domingo - Escuela 10h30 / Servicio 11h20'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Artículos / Palabra de Vida */}
            {articulos.length > 0 && (
                <section className={styles.articlesSection}>
                    <div className={styles.container}>
                        <h2 className={styles.sectionTitle}>Palabra de Vida</h2>
                        <div className={styles.articlesGrid}>
                            {articulos.slice(0, 3).map((articulo) => (
                                <article key={articulo.id} className={styles.articleCard}>
                                    <div className={styles.articleBody}>
                                        <div className={styles.articleMeta}>
                                            {new Date(articulo.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <h3 className={styles.articleTitle}>{articulo.titulo}</h3>
                                        <p className={styles.articleText}>
                                            {articulo.contenido}
                                        </p>
                                        <span className={styles.readMoreBtn}>
                                            Publicado por: {articulo.autor || 'La Iglesia'}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Feed de Instagram */}
            <section className={styles.instagramSection}>
                <div className={styles.instagramContainer}>
                    <div className={styles.instagramPlaceholder}>
                        <i className="bi bi-instagram" style={{ fontSize: '3rem', color: '#E4405F' }}></i>
                        <p className={styles.instagramText}>Síguenos en Instagram @iglesiatupahue</p>
                        <a
                            href="https://www.instagram.com/iglesiatupahue"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.instagramButton}
                        >
                            Ver en Instagram
                        </a>
                    </div>
                </div>
            </section>

            <hr className={styles.divider} />

            {/* Footer */}
            <Footer />
        </div>
    );
}
