'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    signOut, 
    eliminarReserva,
    getLibros,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    getArticulos,
    crearArticulo,
    actualizarArticulo,
    eliminarArticulo
} from '../../lib/supabase';
import { supabase } from '@/lib/supabase';
import styles from './admin.module.css';

export default function AdminClient({ user }) {
    const [reservas, setReservas] = useState([]);
    const [articulos, setArticulos] = useState([]);
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('reservas');
    
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
    const [busquedaLibro, setBusquedaLibro] = useState('');

    // Estados para Artículos
    const [newArticulo, setNewArticulo] = useState({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
    const [publicando, setPublicando] = useState(false);
    const [editingArticuloId, setEditingArticuloId] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'reservas') fetchReservas();
        else if (activeTab === 'articulos') fetchArticulos();
        else if (activeTab === 'libros') fetchLibros();
    }, [activeTab]);

    async function fetchReservas() {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/admin/reservas', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            const { data } = await response.json();
            setReservas(data || []);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }

    async function fetchArticulos() {
        setLoading(true);
        try {
            const { data } = await getArticulos();
            setArticulos(data || []);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }

    async function fetchLibros() {
        setLoading(true);
        try {
            const { data } = await getLibros();
            setLibros(data || []);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    // Handlers para libros y artículos
    const handleCrearArticulo = async (e) => {
        e.preventDefault();
        setPublicando(true);
        try {
            if (editingArticuloId) {
                await actualizarArticulo(editingArticuloId, newArticulo);
                alert('✅ Reflexión actualizada');
                setEditingArticuloId(null);
            } else {
                await crearArticulo(newArticulo);
                alert('✅ Reflexión publicada');
            }
            setNewArticulo({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
            fetchArticulos();
        } catch (error) { alert(error.message); } finally { setPublicando(false); }
    };

    const prepareEditArticulo = (art) => {
        setNewArticulo({ titulo: art.titulo, contenido: art.contenido, autor: art.autor || '' });
        setEditingArticuloId(art.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCrearLibro = async (e) => {
        e.preventDefault();
        setGuardandoLibro(true);
        try {
            const payload = {
                ...newLibro,
                paginas: parseInt(newLibro.paginas) || 0,
                cantidad: parseInt(newLibro.cantidad) || 0,
                disponible: parseInt(newLibro.cantidad) > 0
            };
            if (editingLibroId) {
                await actualizarLibro(editingLibroId, payload);
                alert('✅ Actualizado');
            } else {
                await crearLibro(payload);
                alert('✅ Guardado');
            }
            setNewLibro({ titulo: '', autor: '', categoria: 'Teología', paginas: '', cantidad: 1, imagen_url: '', disponible: true });
            setEditingLibroId(null);
            fetchLibros();
        } catch (error) { alert(error.message); } finally { setGuardandoLibro(false); }
    };

    const prepareEditLibro = (libro) => {
        setNewLibro({ titulo: libro.titulo, autor: libro.autor, categoria: libro.categoria, paginas: libro.paginas || '', cantidad: libro.cantidad, imagen_url: libro.imagen_url || '', disponible: libro.disponible });
        setEditingLibroId(libro.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar user={user} onLogout={handleLogout} />
            <div className={styles.container}>
                <div className={styles.adminHeader}>
                    <h1 className={styles.title}>Administración</h1>
                </div>

                <div className={styles.tabs}>
                    <button className={`${styles.tabBtn} ${activeTab === 'reservas' ? styles.active : ''}`} onClick={() => setActiveTab('reservas')}>📚 Préstamos</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'articulos' ? styles.active : ''}`} onClick={() => setActiveTab('articulos')}>✍️ Blog</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'libros' ? styles.active : ''}`} onClick={() => setActiveTab('libros')}>📖 Inventario</button>
                </div>

                {loading ? <div className={styles.loading}>Cargando...</div> : (
                    <>
                        {activeTab === 'reservas' && (
                            <div className={styles.tableSection}>
                                <div className={styles.tableContainer}>
                                    <table className={styles.table}>
                                        <thead><tr><th>Usuario</th><th>Libro</th><th>Estado</th><th>Acciones</th></tr></thead>
                                        <tbody>
                                            {reservas.map(res => (
                                                <tr key={res.id}>
                                                    <td>{res.usuario?.nombre}</td>
                                                    <td>{res.libros?.titulo}</td>
                                                    <td>{res.estado}</td>
                                                    <td>
                                                        <button 
                                                            onClick={() => { 
                                                                if(confirm('¿Eliminar esta reserva?')) {
                                                                    eliminarReserva(res.id, res.libro_id).then(({error}) => {
                                                                        if (error) alert('Error: ' + error.message);
                                                                        else fetchReservas();
                                                                    });
                                                                }
                                                            }} 
                                                            className={styles.btnDelete}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'articulos' && (
                            <div className={styles.articlesSection}>
                                <div className={styles.formSection}>
                                    <h2>{editingArticuloId ? '✏️ Editar Reflexión' : '✍️ Nueva Reflexión'}</h2>
                                    <form onSubmit={handleCrearArticulo}>
                                        <input className={styles.input} value={newArticulo.titulo} onChange={e => setNewArticulo({...newArticulo, titulo: e.target.value})} placeholder="Título" required />
                                        <textarea className={styles.textarea} value={newArticulo.contenido} onChange={e => setNewArticulo({...newArticulo, contenido: e.target.value})} placeholder="Contenido" required />
                                        <input className={styles.input} value={newArticulo.autor} onChange={e => setNewArticulo({...newArticulo, autor: e.target.value})} placeholder="Autor" />
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button type="submit" className={styles.submitBtn}>{publicando ? '...' : editingArticuloId ? 'Actualizar' : 'Publicar'}</button>
                                            {editingArticuloId && <button type="button" onClick={() => {setEditingArticuloId(null); setNewArticulo({titulo:'',contenido:'',autor: user?.user_metadata?.nombre || ''})}} className={styles.submitBtn} style={{backgroundColor:'#6c757d'}}>Cancelar</button>}
                                        </div>
                                    </form>
                                </div>
                                <div className={styles.listSection}>
                                    <h2>📋 Reflexiones Publicadas</h2>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead><tr><th>Fecha</th><th>Título</th><th>Autor</th><th>Acciones</th></tr></thead>
                                            <tbody>
                                                {articulos.map(art => (
                                                    <tr key={art.id}>
                                                        <td>{new Date(art.created_at).toLocaleDateString('es-CL')}</td>
                                                        <td>{art.titulo}</td>
                                                        <td>{art.autor || 'La Iglesia'}</td>
                                                        <td>
                                                            <div className={styles.actionButtons}>
                                                                <button onClick={() => prepareEditArticulo(art)} className={styles.btnReminder} style={{backgroundColor:'#ffc107', color:'#000'}}><i className="bi bi-pencil"></i></button>
                                                                <button 
                                                                    onClick={() => { 
                                                                        if(confirm('¿Eliminar esta reflexión?')) {
                                                                            eliminarArticulo(art.id).then(({error}) => {
                                                                                if (error) alert('Error: ' + error.message);
                                                                                else fetchArticulos();
                                                                            });
                                                                        }
                                                                    }} 
                                                                    className={styles.btnDelete}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
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

                        {activeTab === 'libros' && (
                            <div className={styles.articlesSection}>
                                <div className={styles.formSection}>
                                    <h2>{editingLibroId ? '✏️ Editar' : '📚 Nuevo Libro'}</h2>
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
                                                <option value="Infantil">Infantil</option>
                                                <option value="Para Padres">Para Padres</option>
                                                <option value="Reflexión">Reflexión</option>
                                                <option value="Eclesiología">Eclesiología</option>
                                            </select>
                                            <input type="number" className={styles.input} value={newLibro.paginas} onChange={e => setNewLibro({...newLibro, paginas: e.target.value})} placeholder="Páginas" />
                                            <input type="number" className={styles.input} value={newLibro.cantidad} onChange={e => setNewLibro({...newLibro, cantidad: e.target.value})} placeholder="Stock" min="0" />
                                        </div>
                                        <input className={styles.input} value={newLibro.imagen_url} onChange={e => setNewLibro({...newLibro, imagen_url: e.target.value})} placeholder="URL Imagen Portada" />
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button type="submit" className={styles.submitBtn} disabled={guardandoLibro}>{editingLibroId ? 'Actualizar' : 'Guardar'}</button>
                                            {editingLibroId && <button type="button" onClick={() => {setEditingLibroId(null); setNewLibro({titulo:'',autor:'',categoria:'Teología',paginas:'',cantidad:1,imagen_url:'',disponible:true})}} className={styles.submitBtn} style={{backgroundColor:'#6c757d'}}>Cancelar</button>}
                                        </div>
                                    </form>
                                </div>
                                <div className={styles.listSection}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Buscar libro por nombre o autor..." 
                                            className={styles.input} 
                                            value={busquedaLibro} 
                                            onChange={(e) => setBusquedaLibro(e.target.value)} 
                                        />
                                    </div>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead><tr><th>Portada</th><th>Libro</th><th>Stock</th><th>Acciones</th></tr></thead>
                                            <tbody>
                                                {libros.filter(libro => 
                                                    libro.titulo.toLowerCase().includes(busquedaLibro.toLowerCase()) || 
                                                    libro.autor.toLowerCase().includes(busquedaLibro.toLowerCase())
                                                ).map(libro => (
                                                    <tr key={libro.id}>
                                                        <td>{libro.imagen_url ? <img src={libro.imagen_url} alt="P" style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} /> : 'Sin foto'}</td>
                                                        <td>{libro.titulo}</td>
                                                        <td>{libro.cantidad}</td>
                                                        <td>
                                                            <div className={styles.actionButtons}>
                                                                <button onClick={() => prepareEditLibro(libro)} className={styles.btnReminder} style={{backgroundColor:'#ffc107', color:'#000'}}><i className="bi bi-pencil"></i></button>
                                                                <button 
                                                                    onClick={() => {
                                                                        if(confirm('¿Eliminar este libro?')) {
                                                                            eliminarLibro(libro.id).then(({error}) => {
                                                                                if (error) alert('No se pudo eliminar el libro: ' + error.message);
                                                                                else fetchLibros();
                                                                            });
                                                                        }
                                                                    }} 
                                                                    className={styles.btnDelete}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
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

                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
