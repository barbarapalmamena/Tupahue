'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    getCurrentUser, 
    signOut, 
    devolverLibro, 
    eliminarReserva,
    getLibros,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    getArticulos,
    crearArticulo,
    eliminarArticulo
} from '../../lib/supabase';
import { supabase } from '@/lib/supabase';
import styles from './admin.module.css';

export default function AdminClient({ user }) {
    const [reservas, setReservas] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reservas'); // reservas, articulos, libros
    
    // Estados para Libros
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
    const [editingLibroId, setEditingLibroId] = useState(null);

    // Estados para Artículos
    const [newArticulo, setNewArticulo] = useState({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
    const [publicando, setPublicando] = useState(false);

    const [filter, setFilter] = useState('todas');
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
            const { data, error } = await getArticulos();
            if (error) throw error;
            setArticulos(data || []);
        } catch (error) {
            console.error('Error fetching articulos:', error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchLibros() {
        setLoading(true);
        try {
            const { data, error } = await getLibros();
            if (error) throw error;
            setLibros(data || []);
        } catch (error) {
            console.error('Error fetching libros:', error);
        } finally {
            setLoading(false);
        }
    }

    // Handlers para Artículos
    const handleCrearArticulo = async (e) => {
        e.preventDefault();
        if (!newArticulo.titulo || !newArticulo.contenido) {
            alert('Por favor completa el título y el contenido');
            return;
        }
        setPublicando(true);
        try {
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
        if (!confirm('¿Estás seguro de eliminar este artículo?')) return;
        try {
            const { error } = await eliminarArticulo(id);
            if (error) throw error;
            fetchArticulos();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };

    // Handlers para Libros
    const handleCrearLibro = async (e) => {
        e.preventDefault();
        if (!newLibro.titulo || !newLibro.autor) {
            alert('Título y Autor son obligatorios');
            return;
        }

        setGuardandoLibro(true);
        try {
            const libroPayload = {
                ...newLibro,
                paginas: parseInt(newLibro.paginas) || 0,
                cantidad: parseInt(newLibro.cantidad) || 0,
                disponible: parseInt(newLibro.cantidad) > 0,
                imagen: newLibro.imagen_url // Compatibilidad con columna 'imagen'
            };

            if (editingLibroId) {
                const { error } = await actualizarLibro(editingLibroId, libroPayload);
                if (error) throw error;
                alert('✅ Libro actualizado');
            } else {
                const { error } = await crearLibro({
                    ...libroPayload,
                    disponible: parseInt(newLibro.cantidad) > 0 || true
                });
                if (error) throw error;
                alert('✅ Libro añadido');
            }
            setNewLibro({ titulo: '', autor: '', categoria: 'Teología', paginas: '', cantidad: 1, imagen_url: '', disponible: true });
            setEditingLibroId(null);
            fetchLibros();
        } catch (error) {
            alert('❌ Error: ' + error.message);
        } finally {
            setGuardandoLibro(false);
        }
    };

    const prepareEditLibro = (libro) => {
        setNewLibro({
            titulo: libro.titulo,
            autor: libro.autor,
            categoria: libro.categoria,
            paginas: libro.paginas || '',
            cantidad: libro.cantidad,
            imagen_url: libro.imagen_url || '',
            disponible: libro.disponible
        });
        setEditingLibroId(libro.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEliminarLibro = async (id) => {
        if (!confirm('¿Eliminar este libro?')) return;
        try {
            const { error } = await eliminarLibro(id);
            if (error) throw error;
            fetchLibros();
        } catch (error) {
            alert('❌ Error al eliminar');
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    const generateMonthlyReport = async () => {
        if (!confirm('¿Generar reporte mensual?')) return;
        try {
            const response = await fetch('/api/monthly-report', {
                headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'test'}` }
            });
            if (!response.ok) throw new Error('Error al generar reporte');
            alert('✅ Reporte generado y enviado');
        } catch (error) {
            alert('❌ ' + error.message);
        }
    };

    const handleSendReminder = async (reservaId) => {
        if (!confirm('¿Enviar recordatorio?')) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/admin/send-reminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
                body: JSON.stringify({ reservaId })
            });
            if (!response.ok) throw new Error('Error al enviar');
            alert('✅ Recordatorio enviado');
        } catch (error) {
            alert('❌ ' + error.message);
        }
    };

    const handleEliminarReservaAdmin = async (reservaId, libroId) => {
        if (!confirm('¿Eliminar esta reserva?')) return;
        try {
            const { error } = await eliminarReserva(reservaId, libroId);
            if (error) throw error;
            fetchReservas();
        } catch (error) {
            alert('❌ Error al eliminar');
        }
    };

    // Utils para Render
    const getDaysRemaining = (vencimiento, createdAt, paginas) => {
        const dueDate = vencimiento ? new Date(vencimiento) : new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + (paginas < 100 ? 3 : 14)));
        const diff = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getStatusColor = (days) => {
        if (days < 0) return '#dc3545';
        if (days <= 3) return '#ffc107';
        return '#28a745';
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
                            📊 Reporte Mensual
                        </button>
                    )}
                </div>

                <div className={styles.tabs}>
                    <button className={`${styles.tabBtn} ${activeTab === 'reservas' ? styles.active : ''}`} onClick={() => setActiveTab('reservas')}>📚 Préstamos</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'articulos' ? styles.active : ''}`} onClick={() => setActiveTab('articulos')}>✍️ Artículos</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'libros' ? styles.active : ''}`} onClick={() => setActiveTab('libros')}>📖 Inventario</button>
                </div>

                {activeTab === 'reservas' ? (
                    <div className={styles.tableSection}>
                        <div className={styles.filterContainer}>
                            <button className={`${styles.filterBtn} ${filter === 'todas' ? styles.active : ''}`} onClick={() => setFilter('todas')}>Todas</button>
                            <button className={`${styles.filterBtn} ${filter === 'activas' ? styles.active : ''}`} onClick={() => setFilter('activas')}>Activas</button>
                            <button className={`${styles.filterBtn} ${filter === 'devueltas' ? styles.active : ''}`} onClick={() => setFilter('devueltas')}>Devueltas</button>
                        </div>
                        {loading ? <div className={styles.loading}>Cargando...</div> : (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Libro</th>
                                            <th>Vencimiento</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservas.filter(r => filter === 'todas' || r.estado === (filter === 'activas' ? 'activa' : 'devuelto')).map(res => {
                                            const days = getDaysRemaining(res.fecha_vencimiento, res.created_at, res.libros?.paginas);
                                            return (
                                                <tr key={res.id}>
                                                    <td>{res.usuario?.nombre || 'Usuario'}</td>
                                                    <td>{res.libros?.titulo}</td>
                                                    <td>
                                                        {res.estado === 'activa' ? (
                                                            <span style={{ color: getStatusColor(days) }}>{days > 0 ? `${days} días` : 'Atrasado'}</span>
                                                        ) : 'Devuelto'}
                                                    </td>
                                                    <td>
                                                        <span className={`${styles.badge} ${res.estado === 'activa' ? styles.badgeActive : styles.badgeReturned}`}>
                                                            {res.estado === 'activa' ? 'Activa' : 'Devuelto'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {res.estado === 'activa' && (
                                                            <div className={styles.actionButtons}>
                                                                <button onClick={() => handleSendReminder(res.id)} className={styles.btnReminder}><i className="bi bi-envelope"></i></button>
                                                                <button onClick={() => handleEliminarReservaAdmin(res.id, res.libro_id)} className={styles.btnDelete}><i className="bi bi-trash"></i></button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'articulos' ? (
                    <div className={styles.articlesSection}>
                        <div className={styles.formSection}>
                            <h2>📝 Nuevo Artículo</h2>
                            <form onSubmit={handleCrearArticulo}>
                                <input className={styles.input} value={newArticulo.titulo} onChange={e => setNewArticulo({...newArticulo, titulo: e.target.value})} placeholder="Título" required />
                                <textarea className={styles.textarea} value={newArticulo.contenido} onChange={e => setNewArticulo({...newArticulo, contenido: e.target.value})} placeholder="Contenido" required />
                                <button type="submit" className={styles.submitBtn} disabled={publicando}>{publicando ? 'Publicando...' : 'Publicar'}</button>
                            </form>
                        </div>
                        <div className={styles.listSection}>
                            {articulos.map(art => (
                                <div key={art.id} className={styles.articleCard}>
                                    <h3>{art.titulo}</h3>
                                    <button onClick={() => handleEliminarArticulo(art.id)} className={styles.btnDelete}><i className="bi bi-trash"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.articlesSection}>
                        <div className={styles.formSection}>
                            <h2>{editingLibroId ? '✏️ Editar Libro' : '📚 Nuevo Libro'}</h2>
                            <form onSubmit={handleCrearLibro}>
                                <div className={styles.formRow}>
                                    <input className={styles.input} value={newLibro.titulo} onChange={e => setNewLibro({...newLibro, titulo: e.target.value})} placeholder="Título" required />
                                    <input className={styles.input} value={newLibro.autor} onChange={e => setNewLibro({...newLibro, autor: e.target.value})} placeholder="Autor" required />
                                </div>
                                <div className={styles.formRow}>
                                    <select className={styles.input} value={newLibro.categoria} onChange={e => setNewLibro({...newLibro, categoria: e.target.value})}>
                                        <option value="Teología">Teología</option>
                                        <option value="Apologética">Apologética</option>
                                        <option value="Ficción Cristiana">Ficción Cristiana</option>
                                        <option value="Historia">Historia</option>
                                        <option value="Devocionales">Devocionales</option>
                                        <option value="Biografías">Biografías</option>
                                    </select>
                                    <input type="number" className={styles.input} value={newLibro.paginas} onChange={e => setNewLibro({...newLibro, paginas: e.target.value})} placeholder="Nº Páginas" />
                                    <input type="number" className={styles.input} value={newLibro.cantidad} onChange={e => setNewLibro({...newLibro, cantidad: e.target.value})} placeholder="Stock" min="0" />
                                </div>
                                <input className={styles.input} value={newLibro.imagen_url} onChange={e => setNewLibro({...newLibro, imagen_url: e.target.value})} placeholder="URL de la Imagen de Portada" />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" className={styles.submitBtn} disabled={guardandoLibro} style={{ flex: 2 }}>
                                        {guardandoLibro ? 'Guardando...' : editingLibroId ? '💾 Actualizar Libro' : '💾 Guardar Libro'}
                                    </button>
                                    {editingLibroId && (
                                        <button type="button" onClick={() => {setEditingLibroId(null); setNewLibro({titulo:'',autor:'',categoria:'Teología',paginas:'',cantidad:1,imagen_url:'',disponible:true})}} className={styles.submitBtn} style={{backgroundColor:'#6c757d', flex: 1}}>
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                        <div className={styles.listSection}>
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead><tr><th>Libro</th><th>Stock</th><th>Acciones</th></tr></thead>
                                    <tbody>
                                        {libros.map(libro => (
                                            <tr key={libro.id}>
                                                <td>{libro.titulo}</td>
                                                <td>{libro.cantidad}</td>
                                                <td>
                                                    <div className={styles.actionButtons}>
                                                        <button onClick={() => prepareEditLibro(libro)} className={styles.btnReminder} style={{backgroundColor:'#ffc107', color:'#000'}}><i className="bi bi-pencil"></i></button>
                                                        <button onClick={() => handleEliminarLibro(libro.id)} className={styles.btnDelete}><i className="bi bi-trash"></i></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
