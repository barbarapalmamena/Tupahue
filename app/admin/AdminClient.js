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

    // Estados para Artículos
    const [newArticulo, setNewArticulo] = useState({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
    const [publicando, setPublicando] = useState(false);

    const [filter, setFilter] = useState('todas');
    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'reservas') fetchReservas();
        else if (activeTab === 'articulos') fetchArticulos();
        else fetchLibros();
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

    const handleCrearArticulo = async (e) => {
        e.preventDefault();
        setPublicando(true);
        try {
            await crearArticulo(newArticulo);
            setNewArticulo({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
            fetchArticulos();
        } catch (error) { alert(error.message); } finally { setPublicando(false); }
    };

    const handleEliminarArticulo = async (id) => {
        if (confirm('¿Eliminar artículo?')) {
            await eliminarArticulo(id);
            fetchArticulos();
        }
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
                const { error } = await actualizarLibro(editingLibroId, payload);
                if (error) throw error;
                alert('✅ Actualizado');
            } else {
                const { error } = await crearLibro(payload);
                if (error) throw error;
                alert('✅ Guardado');
            }
            setNewLibro({ titulo: '', autor: '', categoria: 'Teología', paginas: '', cantidad: 1, imagen_url: '', disponible: true });
            setEditingLibroId(null);
            fetchLibros();
        } catch (error) { alert('Error: ' + error.message); } finally { setGuardandoLibro(false); }
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
        if (confirm('¿Eliminar libro?')) {
            await eliminarLibro(id);
            fetchLibros();
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
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
                    <button className={`${styles.tabBtn} ${activeTab === 'articulos' ? styles.active : ''}`} onClick={() => setActiveTab('articulos')}>✍️ Artículos</button>
                    <button className={`${styles.tabBtn} ${activeTab === 'libros' ? styles.active : ''}`} onClick={() => setActiveTab('libros')}>📖 Inventario</button>
                </div>

                {activeTab === 'reservas' ? (
                    <div className={styles.tableSection}>
                        {loading ? <div>Cargando...</div> : (
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
                                                    <button onClick={() => { if(confirm('¿Eliminar?')) eliminarReserva(res.id, res.libro_id).then(()=>fetchReservas()) }} className={styles.btnDelete}><i className="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'articulos' ? (
                    <div className={styles.articlesSection}>
                        <div className={styles.formSection}>
                            <form onSubmit={handleCrearArticulo}>
                                <input className={styles.input} value={newArticulo.titulo} onChange={e => setNewArticulo({...newArticulo, titulo: e.target.value})} placeholder="Título" required />
                                <textarea className={styles.textarea} value={newArticulo.contenido} onChange={e => setNewArticulo({...newArticulo, contenido: e.target.value})} placeholder="Contenido" required />
                                <button type="submit" className={styles.submitBtn}>{publicando ? '...' : 'Publicar'}</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className={styles.articlesSection}>
                        <div className={styles.formSection}>
                            <h2>{editingLibroId ? '✏️ Editar' : '📚 Nuevo Libro'}</h2>
                            <form onSubmit={handleCrearLibro}>
                                <div className={styles.formRow}>
                                    <input className={styles.input} value={newLibro.titulo} onChange={e => setNewLibro({...newLibro, titulo: e.target.value})} placeholder="Título" required />
                                    <input className={styles.input} value={newLibro.autor} onChange={e => setNewLibro({...newLibro, autor: e.target.value})} placeholder="Autor" required />
                                </div>
                                <div className={styles.formRow}>
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
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead><tr><th>Portada</th><th>Libro</th><th>Stock</th><th>Acciones</th></tr></thead>
                                    <tbody>
                                        {libros.map(libro => (
                                            <tr key={libro.id}>
                                                <td>
                                                    {libro.imagen_url ? (
                                                        <img src={libro.imagen_url} alt="Portada" style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    ) : (
                                                        <div style={{ width: '40px', height: '60px', backgroundColor: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#999' }}>Sin foto</div>
                                                    )}
                                                </td>
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
