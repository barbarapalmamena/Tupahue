'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './ministerios.module.css';

export default function MinisteriosClient() {
    const ministerios = [
        {
            icon: 'bi-music-note-beamed',
            titulo: 'Ministerio de Alabanza',
            descripcion: 'Dirigimos la adoración congregacional a través de la música, preparando nuestros corazones para el encuentro con Dios.',
            encargado: 'Equipo de Alabanza'
        },
        {
            icon: 'bi-book',
            titulo: 'Ministerio de Enseñanza',
            descripcion: 'Estudio profundo de la Palabra de Dios, formando discípulos comprometidos con la verdad bíblica.',
            encargado: 'Equipo Pastoral'
        },
        {
            icon: 'bi-people',
            titulo: 'Ministerio de Jóvenes',
            descripcion: 'Espacio de comunión y crecimiento para los jóvenes de nuestra iglesia, fomentando una fe viva y relevante.',
            encargado: 'Líderes de Jóvenes'
        },
        {
            icon: 'bi-heart',
            titulo: 'Ministerio de Diaconía',
            descripcion: 'Servicio práctico a la comunidad, atendiendo necesidades materiales y espirituales de quienes nos rodean.',
            encargado: 'Diáconos'
        },
        {
            icon: 'bi-chat-dots',
            titulo: 'Ministerio de Oración',
            descripcion: 'Intercesión constante por la iglesia, la ciudad y las naciones, buscando el mover de Dios en cada área.',
            encargado: 'Equipo de Oración'
        },
        {
            icon: 'bi-globe',
            titulo: 'Ministerio de Misiones',
            descripcion: 'Alcanzando las naciones con el evangelio de Cristo, apoyando misioneros y proyectos alrededor del mundo.',
            encargado: 'Equipo de Misiones'
        }
    ];

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className={styles.hero} style={{ backgroundImage: "url('/img/inicio.jpg')" }}>
                <h1 className={styles.heroTitle}>Nuestros Ministerios</h1>
            </section>

            {/* ===== MINISTERIOS ===== */}
            <section className={styles.ministeriosSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Áreas de Servicio</h2>
                    <div className={styles.ministeriosGrid}>
                        {ministerios.map((ministerio, index) => (
                            <div key={index} className={styles.ministerioCard}>
                                <div className={styles.cardBody}>
                                    <div className={styles.ministerioIcon}>
                                        <i className={`bi ${ministerio.icon}`}></i>
                                    </div>
                                    <h3 className={styles.cardTitle}>{ministerio.titulo}</h3>
                                    <p className={styles.cardText}>{ministerio.descripcion}</p>
                                    <div className={styles.encargado}>
                                        <p className={styles.encargadoNombre}>
                                            <i className="bi bi-person-fill"></i> {ministerio.encargado}
                                        </p>
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
