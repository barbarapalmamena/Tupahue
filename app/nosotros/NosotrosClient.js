'use client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './nosotros.module.css';

export default function NosotrosClient() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />

            {/* ===== HERO ===== */}
            <section className={styles.hero} style={{ backgroundImage: "url('/img/inicio.jpg')" }}>
            </section>

            {/* ===== VISIÓN Y MISIÓN ===== */}
            <section className={styles.misionVisionSection}>
                <div className={styles.container}>
                    <h1 className={styles.mainTitle}>¿Quiénes Somos?</h1>
                    <div className={styles.contentBox}>
                        <p className={styles.textMuted}>
                            Personas que expresan la misma fe, reciben el mismo Señor, creen en su nombre y fueron llamadas a hacer parte de La Iglesia Universal donde están todos aquellos que hacen la voluntad del Padre.
                        </p>
                    </div>

                    <hr className={styles.divider} />

                    <h2 className={styles.sectionTitle}>Visión</h2>
                    <div className={styles.contentBox}>
                        <p className={styles.textMuted}>
                            Ser una iglesia compuesta por discípulos diversos que orientan integralmente su vida de acuerdo con el evangelio buscando hacer el verdadero Jesús conocido en Puerto Montt y alrededor del mundo para la gloria de Dios
                        </p>
                    </div>

                    <hr className={styles.divider} />

                    <h2 className={styles.sectionTitle}>Misión</h2>
                    <div className={styles.contentBox}>
                        <p className={styles.textMuted}>
                            La iglesia Tupahue existe para anunciar el evangelio en Puerto Montt y hasta el fin de la tierra, uniéndonos a Dios en su propósito de hacer nuevas todas las cosas a través de la persona y obra de Jesús. Nos reunimos semanalmente para proclamar las buenas nuevas del evangelio y responder en adoración, recordando la historia de la redención, y renovando nuestro pacto con Dios. Nos reunimos durante la semana, para reuniones de oración, en casas, buscando vivir y anunciar el evangelio.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== CREENCIAS ===== */}
            <section className={styles.creenciasSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Nuestras Creencias</h2>
                    <div className={styles.creenciasList}>
                        <div className={styles.creenciaItem}>
                            <p className={styles.creenciaTitle}><span className={styles.creenciaNumber}>1</span> Vemos la obra de Dios en conformidad con su eterno propósito</p>
                            <p className={styles.textMuted}>Todo lo que Dios Padre está haciendo en la historia, prepara una novia para su hijo Jesucristo, y edifica una habitación para su espíritu, para que el pueblo de Dios viva para la alabanza de su gloria y Cristo Jesús sea glorificado en ellos.</p>
                        </div>
                        <div className={styles.creenciaItem}>
                            <p className={styles.creenciaTitle}><span className={styles.creenciaNumber}>2</span> Nos movemos de acuerdo con una perspectiva sacerdotal</p>
                            <p className={styles.textMuted}>La iglesia es un pueblo sacerdotal; nuestra misión es presentar la creación y el mundo delante de Dios (para la gloria de Dios), delante de los santos (para la edificación de la iglesia) y delante del mundo (para el bien del mundo).</p>
                        </div>
                        <div className={styles.creenciaItem}>
                            <p className={styles.creenciaTitle}><span className={styles.creenciaNumber}>3</span> Priorizamos el evangelio</p>
                            <p className={styles.textMuted}>El evangelio es el glorioso anuncio de lo que Dios hizo por medio de la vida, muerte y resurrección de Jesús. Queremos que todas las personas oigan, crean y sean transformadas por las buenas nuevas de Cristo.</p>
                        </div>
                        <div className={styles.creenciaItem}>
                            <p className={styles.creenciaTitle}><span className={styles.creenciaNumber}>4</span> Comprometámonos con la comunidad</p>
                            <p className={styles.textMuted}>Somos salvados del aislamiento e insertados en una nueva comunidad conocida como el pueblo Redimido de Dios. Demostramos el evangelio y declaramos lo que Cristo hizo cuando nos amamos como comunidad.</p>
                        </div>
                        <div className={styles.creenciaItem}>
                            <p className={styles.creenciaTitle}><span className={styles.creenciaNumber}>5</span> Valoramos la cultura</p>
                            <p className={styles.textMuted}>Queremos estar intencionalmente presentes en nuestra ciudad para el bien de nuestro prójimo y para la gloria de Dios, sin perder el poder de transformar vidas.</p>
                        </div>
                        <div className={styles.creenciaItem}>
                            <p className={styles.creenciaTitle}><span className={styles.creenciaNumber}>6</span> Honramos la historia</p>
                            <p className={styles.textMuted}>Somos parte de un movimiento histórico de hombres y mujeres que buscaron a Dios con celo. Priorizamos las liturgias antiguas y aprendemos del testimonio de quienes nos precedieron.</p>
                        </div>
                        <div className={styles.creenciaItem}>
                            <p className={styles.creenciaTitle}><span className={styles.creenciaNumber}>7</span> Tenemos una Cosmovisión bíblica cristiana</p>
                            <p className={styles.textMuted}>Miramos toda la vida a través de las lentes del Evangelio. La meta narrativa de creación, caída, redención y consumación nos muestra que todas las cosas fueron creadas por Dios, afectadas por el pecado y necesitan ser redimidas a los pies de la cruz.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== DECLARACIÓN DE FE ===== */}
            <section className={styles.declaracionSection}>
                <div className={styles.container}>
                    <div className={styles.declaracionCard}>
                        <div className={styles.declaracionBody}>
                            <h2 className={styles.declaracionTitle}>Declaración de Fe</h2>
                            <h3 className={styles.declaracionSubtitle}>I. Fundamentos básicos de la fe</h3>
                            <ol className={styles.orderedList}>
                                <li>Hay un Dios, existiendo eternamente en la Trinidad Padre, Hijo y Espíritu Santo.</li>
                                <li>Por amor, Dios envió su Hijo Jesucristo para morir por nuestros pecados y resucitar de los muertos, para rescatar pecadores y redimir la creación.</li>
                                <li>Aquellos que confían en Cristo deben arrepentirse del pecado, confesar la fe y ser bautizados.</li>
                                <li>La iglesia es el cuerpo de Cristo en la tierra, con el poder del Espíritu Santo para continuar la tarea de alcanzar los perdidos, discipular los salvos y reflejar el reino en misericordia, unidad y amor.</li>
                                <li>La salvación es un regalo gratuito de Dios. Tornando posible por la muerte y resurrección de Jesús y recibido por la fe.</li>
                                <li>La Biblia es la Palabra Inspirada de Dios y la autoridad final en la vida y en la doctrina.</li>
                                <li>Cuando muramos, seremos separados de Dios por el pecado o unidos a él eternamente por la fe en Cristo Jesús como nuestro Señor y Salvador.</li>
                                <li>Cristo volverá un día, restaurará la creación y reinará para siempre.</li>
                            </ol>

                            <h3 className={styles.declaracionSubtitle}>II. Declaración de fe</h3>
                            <ol className={styles.orderedList}>
                                <li><strong>El Dios trino:</strong> creemos en uno solo Dios, que existe eternamente en tres personas igualmente divinas: Padre, Hijo y Espíritu Santo, que conocen, aman y glorifican uno al otro.</li>
                                <li><strong>Revelación:</strong> Dios graciosamente reveló su existencia y poder en la orden criada, y se ha revelado de manera suprema a los seres humanos caídos en la persona de su hijo, el verbo encarnado.</li>
                                <li><strong>Creación de la humanidad:</strong> creemos que Dios creó a los seres humanos, macho y hembra, a su propia imagen.</li>
                                <li><strong>La caída:</strong> creemos que Adán, hecho a imagen de Dios, destorció esa imagen y perdió su bendición original al caer en pecado por la tentación de Satanás.</li>
                                <li><strong>El plan de Dios:</strong> creemos que desde toda la eternidad Dios determinó en su gracia, salvar una grande multitud de pecadores culpables.</li>
                                <li><strong>El evangelio:</strong> creemos que el evangelio es las buenas nuevas de Jesucristo - la propia sabiduría de Dios.</li>
                                <li><strong>Retención de Cristo:</strong> creemos que, movido por el amor y en obediencia al padre el hijo eterno se hizo hombre.</li>
                                <li><strong>La justificación de pecadores:</strong> creemos que Cristo, por su obediencia y muerte pagó completamente la deuda de todos aquellos que son por el justificados.</li>
                                <li><strong>El poder del Espíritu Santo:</strong> creemos que esa salvación, atestada en toda la escritura y asegurada por Jesucristo, es aplicada a su pueblo por el Espíritu Santo.</li>
                                <li><strong>El reino de Dios:</strong> creemos que aquellos que fueron salvados por la gracia de Dios mediante la unión con Cristo, por la fe y por la regeneración del Espíritu Santo, entran en el reino de Dios.</li>
                                <li><strong>El nuevo pueblo de Dios:</strong> creemos que el pueblo de la nueva alianza de Dios ya vino a Jerusalén celestial.</li>
                                <li><strong>Bautismo y cena del Señor:</strong> creemos que el bautismo y la cena del señor son ordenados por el propio señor Jesús.</li>
                                <li><strong>La restauración de todas las cosas:</strong> creemos en la vuelta personal, gloriosa y corporal de Nuestro Señor Jesucristo con sus santos ángeles.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
