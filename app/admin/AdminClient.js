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
    const [config, setConfig] = useState([]);
    const [ministerios, setMinisterios] = useState([]);
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

    // Estados para Configuración
    const [savingConfig, setSavingConfig] = useState(false);
    const [editingMinisterio, setEditingMinisterio] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (activeTab === 'reservas') fetchReservas();
        else if (activeTab === 'articulos') fetchArticulos();
        else if (activeTab === 'libros') fetchLibros();
        else if (activeTab === 'sitio') fetchSitio();
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

    async function fetchSitio() {
        setLoading(true);
        try {
            const { data: configData } = await supabase.from('configuracion').select('*');
            const { data: minData } = await supabase.from('ministerios').select('*').order('id');
            setConfig(configData || []);
            setMinisterios(minData || []);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }

    const handleUpdateConfig = async (clave, valor) => {
        setSavingConfig(true);
        try {
            await supabase.from('configuracion').update({ valor }).eq('clave', clave);
            fetchSitio();
        } catch (error) { alert(error.message); } finally { setSavingConfig(false); }
    };

    const handleUpdateMinisterio = async (e) => {
        e.preventDefault();
        try {
            await supabase.from('ministerios').update({
                nombre: editingMinisterio.nombre,
                descripcion: editingMinisterio.descripcion,
                encargado: editingMinisterio.encargado,
                icono: editingMinisterio.icono
            }).eq('id', editingMinisterio.id);
            setEditingMinisterio(null);
            fetchSitio();
            alert('✅ Ministerio actualizado');
        } catch (error) { alert(error.message); }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    // Handlers para libros y artículos (se mantienen igual)
    const handleCrearArticulo = async (e) => {
        e.preventDefault();
        setPublicando(true);
        try {
            await crearArticulo(newArticulo);
            setNewArticulo({ titulo: '', contenido: '', autor: user?.user_metadata?.nombre || '' });
            fetchArticulos();
        } catch (error) { alert(error.message); } finally { setPublicando(false); }
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
                    <button className={`${styles.tabBtn} ${activeTab === 'sitio' ? styles.active : ''}`} onClick={() => setActiveTab('sitio')}>🌐 Sitio</button>
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
                                                        <button onClick={() => { if(confirm('¿Eliminar?')) eliminarReserva(res.id, res.libro_id).then(()=>fetchReservas()) }} className={styles.btnDelete}><i className="bi bi-trash"></i></button>
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
                                    <form onSubmit={handleCrearArticulo}>
                                        <input className={styles.input} value={newArticulo.titulo} onChange={e => setNewArticulo({...newArticulo, titulo: e.target.value})} placeholder="Título" required />
                                        <textarea className={styles.textarea} value={newArticulo.contenido} onChange={e => setNewArticulo({...newArticulo, contenido: e.target.value})} placeholder="Contenido" required />
                                        <button type="submit" className={styles.submitBtn}>{publicando ? '...' : 'Publicar'}</button>
                                    </form>
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
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead><tr><th>Portada</th><th>Libro</th><th>Stock</th><th>Acciones</th></tr></thead>
                                            <tbody>
                                                {libros.map(libro => (
                                                    <tr key={libro.id}>
                                                        <td>{libro.imagen_url ? <img src={libro.imagen_url} alt="P" style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} /> : 'Sin foto'}</td>
                                                        <td>{libro.titulo}</td>
                                                        <td>{libro.cantidad}</td>
                                                        <td>
                                                            <div className={styles.actionButtons}>
                                                                <button onClick={() => prepareEditLibro(libro)} className={styles.btnReminder} style={{backgroundColor:'#ffc107', color:'#000'}}><i className="bi bi-pencil"></i></button>
                                                                <button onClick={() => {if(confirm('¿Eliminar?')) eliminarLibro(libro.id).then(()=>fetchLibros())}} className={styles.btnDelete}><i className="bi bi-trash"></i></button>
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

                        {activeTab === 'sitio' && (
                            <div className={styles.sitioSection}>
                                <div className={styles.sitioGrid}>
                                    <div className={styles.configCard}>
                                        <h3>🏠 Inicio y Nosotros</h3>
                                        {config.map(item => (
                                            <div key={item.clave} className={styles.configItem}>
                                                <label>{item.clave.replace(/_/g, ' ').toUpperCase()}</label>
                                                <textarea 
                                                    className={styles.textarea} 
                                                    defaultValue={item.valor} 
                                                    onBlur={(e) => handleUpdateConfig(item.clave, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.configCard}>
                                        <h3>⛪ Ministerios</h3>
                                        <div className={styles.tableContainer}>
                                            <table className={styles.table}>
                                                <thead><tr><th>Nombre</th><th>Encargado</th><th>Acciones</th></tr></thead>
                                                <tbody>
                                                    {ministerios.map(m => (
                                                        <tr key={m.id}>
                                                            <td>{m.nombre}</td>
                                                            <td>{m.encargado}</td>
                                                            <td>
                                                                <button onClick={() => setEditingMinisterio(m)} className={styles.btnReminder} style={{backgroundColor:'#ffc107', color:'#000'}}><i className="bi bi-pencil"></i></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {editingMinisterio && (
                                            <div className={styles.editModal} style={{marginTop:'2rem', padding:'1rem', border:'1px solid #ddd', borderRadius:'8px'}}>
                                                <h4>Editar {editingMinisterio.nombre}</h4>
                                                <form onSubmit={handleUpdateMinisterio}>
                                                    <input className={styles.input} value={editingMinisterio.nombre} onChange={e => setEditingMinisterio({...editingMinisterio, nombre: e.target.value})} placeholder="Nombre" />
                                                    <input className={styles.input} value={editingMinisterio.encargado} onChange={e => setEditingMinisterio({...editingMinisterio, encargado: e.target.value})} placeholder="Encargado" />
                                                    <textarea className={styles.textarea} value={editingMinisterio.descripcion} onChange={e => setEditingMinisterio({...editingMinisterio, descripcion: e.target.value})} placeholder="Descripción" />
                                                    <div style={{display:'flex', gap:'1rem'}}>
                                                        <button type="submit" className={styles.submitBtn}>Guardar</button>
                                                        <button type="button" onClick={() => setEditingMinisterio(null)} className={styles.submitBtn} style={{backgroundColor:'#6c757d'}}>Cancelar</button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
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
