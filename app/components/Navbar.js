'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { supabase, signOut } from '@/lib/supabase';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase
                    .from('perfiles')
                    .select('rol')
                    .eq('id', user.id)
                    .single();
                if (data?.rol === 'admin') {
                    setIsAdmin(true);
                }
            }
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user) {
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setIsAdmin(false);
        setIsOpen(false);
    };

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const isActive = (path) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <Link href="/" className={styles.navbarBrand} onClick={closeMenu}>
                    <img src="/img/LogoTupahue.png" alt="Logo Tupahue" className={styles.logoNavbar} />
                </Link>

                <button className={styles.navbarToggler} onClick={toggleMenu} aria-label="Toggle navigation">
                    <span className={styles.navbarTogglerIcon}></span>
                </button>

                <div className={`${styles.navbarCollapse} ${isOpen ? styles.navbarCollapseShow : ''}`}>
                    <ul className={styles.navbarNav}>
                        <li className={styles.navItem}>
                            <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`} onClick={closeMenu}>
                                Inicio
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/actividades" className={`${styles.navLink} ${isActive('/actividades') ? styles.navLinkActive : ''}`} onClick={closeMenu}>
                                Actividades
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/nosotros" className={`${styles.navLink} ${isActive('/nosotros') ? styles.navLinkActive : ''}`} onClick={closeMenu}>
                                Nosotros
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/ministerios" className={`${styles.navLink} ${isActive('/ministerios') ? styles.navLinkActive : ''}`} onClick={closeMenu}>
                                Ministerios
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/biblioteca" className={`${styles.navLink} ${isActive('/biblioteca') ? styles.navLinkActive : ''}`} onClick={closeMenu}>
                                Biblioteca
                            </Link>
                        </li>

                        {user ? (
                            <>
                                {isAdmin && (
                                    <li className={styles.navItem}>
                                        <Link href="/admin" className={styles.btnAdmin} onClick={closeMenu}>
                                            Admin
                                        </Link>
                                    </li>
                                )}
                                <li className={styles.navItem}>
                                    <Link href="/mis-reservas" className={styles.navLink} onClick={closeMenu}>
                                        Mis Reservas
                                    </Link>
                                </li>
                                <li className={styles.navItem}>
                                    <button onClick={handleLogout} className={styles.btnLogout}>
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className={styles.navItem}>
                                <Link href="/login" className={styles.btnLogin} onClick={closeMenu}>
                                    Iniciar Sesión
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
