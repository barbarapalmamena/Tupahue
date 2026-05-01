'use client';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import styles from './page.module.css';

export default function HomeClient() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className={styles.hero} style={{ backgroundImage: "url('/img/inicio.jpg')" }}>
                <div>
                    <h1 className={styles.heroTitle}>
                        BIENVENIDOS<br />IGLESIA TUPAHUE<br />REFORMADA
                    </h1>
                </div>
            </section>

            {/* ===== MISIÓN Y VISIÓN ===== */}
            <section className={styles.misionVision}>
                <p className={styles.misionText}>
                    Somos una iglesia formada por personas que expresan la misma fe, reciben el mismo Señor, 
                    creen en su nombre y fueron llamados a ser parte de una nueva familia donde están todos 
                    aquellos que hacen la voluntad del Padre.
                </p>
            </section>

            <hr className={styles.divider} />

            {/* ===== NUESTROS SERVICIOS (VIDEOS) ===== */}
            <section className={styles.videosSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
                    <div className={styles.videosGrid}>
                        <div className={styles.videoCard}>
                            <div className={styles.videoContainer}>
                                <iframe
                                    src="https://www.youtube.com/embed/WZ5mReJq47Y"
                                    title="El Credo"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                        <div className={styles.videoCard}>
                            <div className={styles.videoContainer}>
                                <iframe
                                    src="https://www.youtube.com/embed/videoseries?list=PLFj9mRBQdQ8h_2BaK1v1XGI_p0YBJNmNh"
                                    title="Servicio Dominical"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                        <div className={styles.videoCard}>
                            <div className={styles.videoContainer}>
                                <iframe
                                    src="https://www.youtube.com/embed/videoseries?list=PLFj9mRBQdQ8jMm7MMYBxd-WkCY1v9fmBB"
                                    title="Estudio Bíblico"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className={styles.divider} />

            {/* ===== ENCUENTROS ===== */}
            <section className={styles.encuentrosSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nuestros Encuentros</h2>
                    <div className={styles.encuentrosGrid}>
                        <div className={styles.encuentroCard}>
                            <div className={styles.encuentroImageContainer}>
                                <img src="/img/oracion.jpeg" alt="Reunión de Oración" className={styles.encuentroImage} />
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Reunión de Oración</h3>
                                <p className={styles.cardText}>Miércoles 19:30 hrs</p>
                                <p className={styles.cardText}>Deber Cumplido 253</p>
                            </div>
                        </div>
                        <div className={styles.encuentroCard}>
                            <div className={styles.encuentroImageContainer}>
                                <img src="/img/servicio.jpeg" alt="Servicio Dominical" className={styles.encuentroImage} />
                            </div>
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>Servicio Dominical</h3>
                                <p className={styles.cardText}>Domingo 11:00 hrs</p>
                                <p className={styles.cardText}>Deber Cumplido 253</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className={styles.divider} />

            {/* ===== INSTAGRAM ===== */}
            <section className={styles.instagramSection}>
                <div className={styles.instagramContainer}>
                    <div className={styles.instagramPlaceholder}>
                        <h2 className={styles.sectionTitle}>
                            <i className="bi bi-instagram"></i> Síguenos en Instagram
                        </h2>
                        <p className={styles.instagramText}>
                            Mantente al día con nuestras actividades y eventos
                        </p>
                        <a href="https://www.instagram.com/iglesiatupahue" target="_blank" rel="noopener noreferrer" className={styles.instagramButton}>
                            <i className="bi bi-instagram"></i> @iglesiatupahue
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
