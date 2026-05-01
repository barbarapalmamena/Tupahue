'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    getCurrentUser, 
    signOut, 
    devolverLibro, 
    eliminarReserva 
} from '../../lib/supabase';
import { supabase } from '@/lib/supabase';
import styles from './admin.module.css';

export default function AdminClient({ user }) {
    const [reservas, setReservas] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reservas'); // reservas, articulos, libros
    const [libros, setLibros] = useState([]);
    const [newLibro, setNewLibro] = useState({ 
        titulo: '', 
        autor: '', 
        categoria: 'Teología', 
        paginas: '', 
        cantidad: 1, 
        imagen_url: '', 
        disponible: true 
    });
    const [guardandoLibro, setGuardandoLibro] = useState(false);
    const [filter, setFilter] = useState('todas');
    const [newArticulo, setNewArticulo] = useState({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
    const [publicando, setPublicando] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'reservas') {
            fetchReservas();
        } else if (activeTab === 'articulos') {
            fetchArticulos();
        } else {
            fetchLibros();
        }
    }, [activeTab]);

    async function fetchReservas() {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/admin/reservas', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (!response.ok) throw new Error('Error al obtener reservas');
            const { data } = await response.json();
            setReservas(data || []);
        } catch (error) {
            console.error('Error fetching reservas:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchArticulos() {
        setLoading(true);
        try {
            const { getArticulos } = await import('@/lib/supabase');
            const { data, error } = await getArticulos();
            if (error) throw error;
            setArticulos(data || []);
        } catch (error) {
            console.error('Error fetching articulos:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCrearArticulo = async (e) => {
        e.preventDefault();
        if (!newArticulo.titulo || !newArticulo.contenido) {
            alert('Por favor completa el título y el contenido');
            return;
        }

        setPublicando(true);
        try {
            const { crearArticulo } = await import('@/lib/supabase');
            const { error } = await crearArticulo(newArticulo);
            if (error) throw error;

            alert('✅ Artículo publicado con éxito');
            setNewArticulo({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
            fetchArticulos();
        } catch (error) {
            console.error('Error al publicar:', error);
            alert('❌ Error al publicar el artículo');
        } finally {
            setPublicando(false);
        }
    };

    const handleEliminarArticulo = async (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este artículo?')) return;

        try {
            const { eliminarArticulo } = await import('@/lib/supabase');
            const { error } = await eliminarArticulo(id);
            if (error) throw error;
            fetchArticulos();
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('❌ Error al eliminar el artículo');
        }
    };

    async function fetchLibros() {
        setLoading(true);
        try {
            const { getLibros } = await import('@/lib/supabase');
            const { data, error } = await getLibros();
            if (error) throw error;
            setLibros(data || []);
        } catch (error) {
            console.error('Error fetching libros:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCrearLibro = async (e) => {
        e.preventDefault();
        if (!newLibro.titulo || !newLibro.autor) {
            alert('Título y Autor son obligatorios');
            return;
        }

        setGuardandoLibro(true);
        try {
            const { crearLibro } = await import('@/lib/supabase');
            const { data, error } = await crearLibro({
                ...newLibro,
                paginas: parseInt(newLibro.paginas) || 0,
                cantidad: parseInt(newLibro.cantidad) || 1,
                disponible: true
            });

            if (error) {
                alert(`❌ Error de Base de Datos: ${error.message}`);
                return;
            }

            alert('✅ Libro añadido con éxito');
            setNewLibro({ titulo: '', autor: '', categoria: 'Teología', paginas: '', cantidad: 1, imagen_url: '', disponible: true });
            fetchLibros();
        } catch (error) {
            console.error('Error al crear libro:', error);
            alert('❌ Error al añadir el libro');
        } finally {
            setGuardandoLibro(false);
        }
    };

    const handleEliminarLibro = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este libro del catálogo?')) return;
        try {
            const { eliminarLibro } = await import('@/lib/supabase');
            const { error } = await eliminarLibro(id);
            if (error) throw error;
            fetchLibros();
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            alert('❌ Error al eliminar');
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    const filteredReservas = reservas.filter(reserva => {
        if (filter === 'activas') return reserva.estado === 'activa';
        if (filter === 'devueltas') return reserva.estado === 'devuelto';
        return true;
    });

    const getDaysRemaining = (vencimientoDB, createdAt, paginas) => {
        const dueDate = vencimientoDB 
            ? new Date(vencimientoDB) 
            : (() => {
                const d = new Date(createdAt);
                d.setDate(d.getDate() + (paginas < 100 ? 3 : 14));
                return d;
            })();
            
        const today = new Date();
        const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getStatusColor = (days) => {
        if (days < 0) return '#dc3545'; // Rojo - atrasado
        if (days <= 3) return '#ffc107'; // Amarillo - próximo a vencer
        return '#28a745'; // Verde - tiempo suficiente
    };

    const handleSendReminder = async (reservaId) => {
        if (!confirm('¿Enviar recordatorio de devolución a este usuario?')) {
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch('/api/admin/send-reminder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ reservaId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar recordatorio');
            }

            alert('✅ Recordatorio enviado correctamente');
        } catch (error) {
            console.error('Error:', error);
            alert(`❌ ${error.message}`);
        }
    };

    const handleEliminarReserva = async (reservaId, libroId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta reserva? El libro volverá a estar disponible.')) {
            return;
        }

        try {
            const { error } = await eliminarReserva(reservaId, libroId);
            if (error) throw error;
            
            alert('✅ Reserva eliminada con éxito.');
            fetchReservas(); // Recargar la tabla
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('❌ Error al eliminar la reserva.');
        }
    };

    const generateMonthlyReport = async () => {
        if (!confirm('¿Generar reporte mensual? Se enviará por email a los administradores.')) {
            return;
        }

        try {
            const response = await fetch('/api/monthly-report', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'test'}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al generar reporte');
            }

            const data = await response.json();
            alert(`✅ Reporte mensual generado y enviado!\n\nEstadísticas de ${data.stats.mes}:\n- Total préstamos: ${data.stats.totalReservas}\n- Usuarios únicos: ${data.stats.usuariosUnicos}`);
        } catch (error) {
            console.error('Error:', error);
            alert(`❌ ${error.message}`);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar user={user} onLogout={handleLogout} />

            <div className={styles.container}>
                <div className={styles.adminHeader}>
                    <div>
                        <h1 className={styles.title}>Panel de Administración</h1>
                        <p className={styles.subtitle}>Gestión integral de la Iglesia</p>
                    </div>
                    {activeTab === 'reservas' && (
                        <button onClick={generateMonthlyReport} className={styles.reportBtn}>
                            📊 Generar Reporte Mensual
                        </button>
                    )}
                </div>

                {/* Tabs de Navegación */}
                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'reservas' ? styles.active : ''}`}
                        onClick={() => setActiveTab('reservas')}
                    >
                        📚 Préstamos
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'articulos' ? styles.active : ''}`}
                        onClick={() => setActiveTab('articulos')}
                    >
                        ✍️ Artículos
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'libros' ? styles.active : ''}`}
                        onClick={() => setActiveTab('libros')}
                    >
                        📚 Inventario Libros
                    </button>
                </div>

                {activeTab === 'reservas' ? (
                    <>
                        {/* Filtros de Reservas */}
                        <div className={styles.filterContainer}>
                            <button className={`${styles.filterBtn} ${filter === 'todas' ? styles.active : ''}`} onClick={() => setFilter('todas')}>
                                Todas ({reservas.length})
                            </button>
                            <button className={`${styles.filterBtn} ${filter === 'activas' ? styles.active : ''}`} onClick={() => setFilter('activas')}>
                                Activas ({reservas.filter(r => r.estado === 'activa').length})
                            </button>
                            <button className={`${styles.filterBtn} ${filter === 'devueltas' ? styles.active : ''}`} onClick={() => setFilter('devueltas')}>
                                Devueltas ({reservas.filter(r => r.estado === 'devuelto').length})
                            </button>
                        </div>

                        {loading ? (
                            <div className={styles.loading}>Cargando reservas...</div>
                        ) : filteredReservas.length === 0 ? (
                            <div className={styles.empty}>No hay reservas para mostrar</div>
                        ) : (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Email</th>
                                            <th>Libro</th>
                                            <th>Autor</th>
                                            <th>Fecha Reserva</th>
                                            <th>Estado</th>
                                            <th>Días Restantes</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReservas.map((reserva) => {
                                            const daysRemaining = getDaysRemaining(reserva.fecha_vencimiento, reserva.created_at, reserva.libros?.paginas);
                                            const userName = reserva.usuario?.nombre || 'Usuario';
                                            const userEmail = reserva.usuario?.email || 'N/A';

                                            return (
                                                <tr key={reserva.id}>
                                                    <td>{userName}</td>
                                                    <td>{userEmail}</td>
                                                    <td>{reserva.libros?.titulo || 'N/A'}</td>
                                                    <td>{reserva.libros?.autor || 'N/A'}</td>
                                                    <td>{new Date(reserva.created_at).toLocaleDateString('es-CL')}</td>
                                                    <td>
                                                        <span className={`${styles.badge} ${reserva.estado === 'activa' ? styles.badgeActive : styles.badgeReturned}`}>
                                                            {reserva.estado === 'activa' ? 'Activa' : 'Devuelto'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {reserva.estado === 'activa' ? (
                                                            <span className={styles.daysRemaining} style={{ color: getStatusColor(daysRemaining) }}>
                                                                {daysRemaining > 0 ? `${daysRemaining} días` : daysRemaining === 0 ? 'Hoy vence' : `${Math.abs(daysRemaining)} días atrasado`}
                                                            </span>
                                                        ) : (
                                                            <span className={styles.returned}>{reserva.fecha_devolucion ? new Date(reserva.fecha_devolucion).toLocaleDateString('es-CL') : 'Devuelto'}</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {reserva.estado === 'activa' ? (
                                                            <div className={styles.actionButtons}>
                                                                <button onClick={() => handleSendReminder(reserva.id)} className={styles.btnReminder} title="Enviar recordatorio">
                                                                    <i className="bi bi-envelope"></i> Enviar
                                                                </button>
                                                                <button onClick={() => handleEliminarReserva(reserva.id, reserva.libro_id)} className={styles.btnDelete} title="Eliminar reserva">
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        ) : <span style={{ color: '#6c757d' }}>-</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                ) : activeTab === 'articulos' ? (
                    <div className={styles.articlesSection}>
                        {/* Formulario de Nuevo Artículo */}
                        <div className={styles.formSection}>
                            <h2>📝 Publicar Nuevo Artículo</h2>
                            <form onSubmit={handleCrearArticulo}>
                                <div className={styles.formGroup}>
                                    <label>Título del Artículo</label>
                                    <input 
                                        type="text" 
                                        className={styles.input}
                                        value={newArticulo.titulo}
                                        onChange={(e) => setNewArticulo({...newArticulo, titulo: e.target.value})}
                                        placeholder="Ej: Reflexión sobre el Salmo 23"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Contenido</label>
                                    <textarea 
                                        className={styles.textarea}
                                        value={newArticulo.contenido}
                                        onChange={(e) => setNewArticulo({...newArticulo, contenido: e.target.value})}
                                        placeholder="Escribe aquí tu reflexión..."
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Autor (Opcional)</label>
                                    <input 
                                        type="text" 
                                        className={styles.input}
                                        value={newArticulo.autor}
                                        onChange={(e) => setNewArticulo({...newArticulo, autor: e.target.value})}
                                    />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={publicando}>
                                    {publicando ? 'Publicando...' : '🚀 Publicar Artículo'}
                                </button>
                            </form>
                        </div>

                        {/* Lista de Artículos Existentes */}
                        <div className={styles.listSection}>
                            <h2>Artículos Publicados</h2>
                            {loading ? (
                                <div className={styles.loading}>Cargando artículos...</div>
                            ) : articulos.length === 0 ? (
                                <div className={styles.empty}>Aún no has publicado ningún artículo.</div>
                            ) : (
                                <div className={styles.articlesGrid}>
                                    {articulos.map(art => (
                                        <div key={art.id} className={styles.articleCard}>
                                            <button 
                                                className={styles.btnDeleteArticle}
                                                onClick={() => handleEliminarArticulo(art.id)}
                                                title="Eliminar artículo"
                                            >
                                                <i className="bi bi-x"></i>
                                            </button>
                                            <h3>{art.titulo}</h3>
                                            <div className={styles.articleMeta}>
                                                <span>Por: {art.autor || 'Anónimo'}</span> • 
                                                <span> {new Date(art.created_at).toLocaleDateString('es-CL')}</span>
                                            </div>
                                            <p>{art.contenido.substring(0, 100)}...</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={styles.articlesSection}>
                        <div className={styles.formSection}>
                            <h2>📚 Añadir Nuevo Libro</h2>
                            <form onSubmit={handleCrearLibro}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Título</label>
                                        <input 
                                            type="text" 
                                            className={styles.input}
                                            value={newLibro.titulo}
                                            onChange={(e) => setNewLibro({...newLibro, titulo: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Autor</label>
                                        <input 
                                            type="text" 
                                            className={styles.input}
                                            value={newLibro.autor}
                                            onChange={(e) => setNewLibro({...newLibro, autor: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Categoría</label>
                                        <select 
                                            className={styles.input}
                                            value={newLibro.categoria}
                                            onChange={(e) => setNewLibro({...newLibro, categoria: e.target.value})}
                                        >
                                            <option value="Teología">Teología</option>
                                            <option value="Apologética">Apologética</option>
                                            <option value="Ficción Cristiana">Ficción Cristiana</option>
                                            <option value="Historia">Historia</option>
                                            <option value="Devocionales">Devocionales</option>
                                            <option value="Biografías">Biografías</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Páginas</label>
                                        <input 
                                            type="number" 
                                            className={styles.input}
                                            value={newLibro.paginas}
                                            onChange={(e) => setNewLibro({...newLibro, paginas: e.target.value})}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Cantidad (Stock)</label>
                                        <input 
                                            type="number" 
                                            className={styles.input}
                                            value={newLibro.cantidad}
                                            onChange={(e) => setNewLibro({...newLibro, cantidad: e.target.value})}
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>URL de la Imagen (Portada)</label>
                                    <input 
                                        type="text" 
                                        className={styles.input}
                                        value={newLibro.imagen_url}
                                        onChange={(e) => setNewLibro({...newLibro, imagen_url: e.target.value})}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn} disabled={guardandoLibro}>
                                    {guardandoLibro ? 'Guardando...' : '💾 Guardar Libro'}
                                </button>
                            </form>
                        </div>

                        <div className={styles.listSection}>
                            <h2>Libros en Catálogo</h2>
                            {loading ? (
                                <div className={styles.loading}>Cargando catálogo...</div>
                            ) : libros.length === 0 ? (
                                <div className={styles.empty}>No hay libros registrados.</div>
                            ) : (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Título</th>
                                                <th>Autor</th>
                                                <th>Stock</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {libros.map(libro => (
                                                <tr key={libro.id}>
                                                    <td>{libro.titulo}</td>
                                                    <td>{libro.autor}</td>
                                                    <td>{libro.cantidad}</td>
                                                    <td>
                                                        <button 
                                                            onClick={() => handleEliminarLibro(libro.id)}
                                                            className={styles.btnDelete}
                                                            style={{ color: '#dc3545' }}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
