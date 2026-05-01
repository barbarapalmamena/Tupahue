'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './actividades.module.css';

export default function ActividadesClient() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className={styles.hero} style={{ backgroundImage: "url('/img/actividades.jpg')" }}>
            </section>

            {/* ===== CALENDARIO ===== */}
            <section className={styles.calendarSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Calendario de Actividades</h2>
                    <div className={styles.calendarContainer}>
                        <iframe
                            className={styles.calendarIframe}
                            src="https://calendar.google.com/calendar/embed?src=iglesiatupahue%40gmail.com&ctz=America%2FSantiago"
                            title="Calendario de actividades"
                        ></iframe>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
