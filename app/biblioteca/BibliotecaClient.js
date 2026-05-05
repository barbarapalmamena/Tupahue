'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./biblioteca.module.css";
import { getLibros, reservarLibro, getCurrentUser, signOut } from '@/lib/supabase';

export default function BibliotecaClient() {
    const router = useRouter();
    const [busqueda, setBusqueda] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [reservando, setReservando] = useState(null);

    // Cargar libros y usuario
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        console.log("Iniciando carga de datos en Biblioteca...");
        setLoading(true);

        try {
            // Obtener usuario actual
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            console.log("Usuario cargado:", currentUser ? currentUser.email : "Sin sesión");

            if (currentUser) {
                const { getUserRole } = await import('@/lib/supabase');
                const role = await getUserRole(currentUser.id);
                setUserRole(role);
                console.log("Rol cargado:", role);
            }

            // Obtener libros
            console.log("Llamando a getLibros()...");
            const { data, error } = await getLibros();
            
            if (error) {
                console.error("Error al cargar libros de Supabase:", error);
            } else {
                console.log("Libros recibidos de Supabase:", data);
                if (data) setLibros(data);
            }
        } catch (err) {
            console.error("Error crítico en cargarDatos:", err);
        }

        setLoading(false);
    };

    const handleReservar = async (libro) => {
        if (!user) {
            alert('Debes iniciar sesión para reservar un libro');
            router.push('/login');
            return;
        }

        // Restringir a administradores
        const isAdmin = userRole === 'admin' || user.user_metadata?.role === 'admin';
        if (isAdmin) {
            alert('Los administradores no pueden realizar reservas de libros.');
            return;
        }

        setReservando(libro.id);

        const { data, error } = await reservarLibro(libro.id);

        if (error) {
            alert(error.message || 'Error al reservar el libro');
        } else {
            // Calcular días de préstamo según páginas
            const diasPrestamo = libro.paginas < 100 ? 7 : 14;
            alert(`¡Libro reservado exitosamente! Tienes ${diasPrestamo} días para devolverlo.`);
            // Recargar libros
            cargarDatos();
        }

        setReservando(null);
    };

    const librosFiltrados = libros.filter(libro => {
        const normalize = (str) => (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const search = normalize(busqueda);
        const titulo = normalize(libro.titulo);
        const autor = normalize(libro.autor);
        
        return titulo.includes(search) || autor.includes(search);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLibros = librosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(librosFiltrados.length / itemsPerPage);

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        router.push('/');
    };

    return (
        <div className={styles.pageContainer}>
            {/* Navbar */}
            <Navbar user={user} onLogout={handleLogout} />

            {/* Contenedor principal */}
            <div className={styles.mainContainer}>
                <h1 className={styles.pageTitle}>Biblioteca</h1>

                {user && (
                    <div className={styles.welcomeMessage}>
                        <i className="bi bi-person-check"></i> Bienvenido, {user.user_metadata?.nombre || user.email}
                    </div>
                )}

                {/* Buscador */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar libro por nombre o autor..." 
                        style={{ padding: '0.8rem', width: '100%', maxWidth: '600px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                        value={busqueda} 
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setCurrentPage(1);
                        }} 
                    />
                </div>

                {/* Libros */}
                {loading ? (
                    <div className={styles.loadingMessage}>
                        <i className="bi bi-hourglass-split"></i> Cargando libros...
                    </div>
                ) : (
                    <>
                        <div className={styles.booksGrid}>
                            {currentLibros.length > 0 ? (
                                currentLibros.map(libro => (
                                    <div key={libro.id} className={styles.bookCard}>
                                    <div className={styles.cardImageContainer}>
                                        {libro.imagen_url ? (
                                            <Image
                                                src={libro.imagen_url}
                                                className={styles.cardImage}
                                                alt={libro.titulo}
                                                width={300}
                                                height={400}
                                                priority={true}
                                            />
                                        ) : (
                                            <div className={styles.placeholderImage}>
                                                <i className="bi bi-book" style={{ fontSize: '3rem', color: '#999' }}></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.cardBody}>
                                        <h5 className={styles.cardTitle}>{libro.titulo}</h5>
                                        <p className={styles.cardText}>
                                            <strong>Autor:</strong> {libro.autor}
                                        </p>
                                        {libro.paginas && (
                                            <p className={styles.cardText}>
                                                <strong>Páginas:</strong> {libro.paginas}
                                            </p>
                                        )}
                                        {libro.disponible && libro.paginas && (
                                            <p className={styles.cardText}>
                                                <strong>Préstamo:</strong> {libro.paginas < 100 ? '7 días' : '14 días'}
                                            </p>
                                        )}
                                        {libro.disponible ? (
                                            <>
                                                {userRole !== 'admin' && user?.user_metadata?.role !== 'admin' ? (
                                                    <button
                                                        onClick={() => handleReservar(libro)}
                                                        className={styles.btnPrimary}
                                                        disabled={reservando === libro.id}
                                                    >
                                                        {reservando === libro.id ? (
                                                            <>
                                                                <i className="bi bi-hourglass-split"></i> Reservando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="bi bi-bookmark-plus"></i> Reservar
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <p style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '1rem' }}>
                                                        Los administradores no realizan reservas.
                                                    </p>
                                                )}
                                            </>
                                        ) : (
                                            <span className={styles.badgeDanger}>
                                                <i className="bi bi-x-circle"></i> No disponible
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noBooks}>No hay libros disponibles en esta categoría.</p>
                        )}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: currentPage === 1 ? '#f8f9fa' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            >
                                Anterior
                            </button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                    </>
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
