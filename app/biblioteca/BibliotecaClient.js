'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './biblioteca.module.css';
import { supabase, getLibros, reservarLibro, getCurrentUser } from '@/lib/supabase';

export default function BibliotecaClient() {
    const [libros, setLibros] = useState([]);
    const [filtro, setFiltro] = useState('Todos');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [categorias, setCategorias] = useState(['Todos']);

    useEffect(() => {
        const init = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);

            const { data, error } = await getLibros();
            if (data) {
                setLibros(data);
                const cats = ['Todos', ...new Set(data.map(l => l.categoria).filter(Boolean))];
                setCategorias(cats);
            }
            setLoading(false);
        };
        init();
    }, []);

    const handleReservar = async (libroId) => {
        if (!user) {
            alert('Debes iniciar sesión para reservar un libro');
            return;
        }
        const { data, error } = await reservarLibro(libroId, user.id);
        if (error) {
            alert(error.message);
        } else {
            alert('¡Libro reservado exitosamente!');
            const { data: updatedLibros } = await getLibros();
            if (updatedLibros) setLibros(updatedLibros);
        }
    };

    const librosFiltrados = filtro === 'Todos'
        ? libros
        : libros.filter(l => l.categoria === filtro);

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.mainContainer}>
                <h1 className={styles.pageTitle}>
                    <i className="bi bi-book"></i> Biblioteca
                </h1>

                {user && (
                    <div className={styles.welcomeMessage}>
                        Bienvenido/a, {user.user_metadata?.nombre || user.email}
                    </div>
                )}

                {loading ? (
                    <p className={styles.loadingMessage}>Cargando libros...</p>
                ) : (
                    <>
                        <div className={styles.filtroContainer}>
                            {categorias.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.btnFilter} ${filtro === cat ? styles.btnFilterActive : ''}`}
                                    onClick={() => setFiltro(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className={styles.booksGrid}>
                            {librosFiltrados.length === 0 ? (
                                <p className={styles.noBooks}>No hay libros disponibles en esta categoría.</p>
                            ) : (
                                librosFiltrados.map(libro => (
                                    <div key={libro.id} className={styles.bookCard}>
                                        <div className={styles.cardImageContainer}>
                                            {libro.imagen_url ? (
                                                <img src={libro.imagen_url} alt={libro.titulo} className={styles.cardImage} />
                                            ) : (
                                                <div className={styles.placeholderImage}>
                                                    <i className="bi bi-book" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.cardBody}>
                                            <h3 className={styles.cardTitle}>{libro.titulo}</h3>
                                            <p className={styles.cardText}><strong>Autor:</strong> {libro.autor}</p>
                                            <p className={styles.cardText}><strong>Categoría:</strong> {libro.categoria}</p>
                                            {libro.paginas && <p className={styles.cardText}><strong>Páginas:</strong> {libro.paginas}</p>}
                                            {libro.disponible ? (
                                                <button
                                                    className={styles.btnPrimary}
                                                    onClick={() => handleReservar(libro.id)}
                                                >
                                                    Reservar
                                                </button>
                                            ) : (
                                                <span className={styles.badgeDanger}>No disponible</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
