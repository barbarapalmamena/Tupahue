'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../login/login.module.css'; // Reutilizamos los estilos de login
import { recuperarPassword } from '@/lib/supabase';

export default function RecuperarClient() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Por favor ingresa tu correo electrónico');
            return;
        }

        setLoading(true);

        try {
            const { error } = await recuperarPassword(email);

            if (error) {
                setError(error.message);
            } else {
                setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor, revísalo.');
            }
        } catch (err) {
            setError('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <section className={styles.loginSection}>
                <div className={styles.container}>
                    <div className={styles.loginCard}>
                        <div className={styles.loginHeader}>
                            <div className={styles.logoContainer}>
                                <Image
                                    src="/img/LogoTupahue.png"
                                    alt="Logo Tupahue"
                                    width={100}
                                    height={100}
                                    className={styles.loginLogo}
                                />
                            </div>
                            <h2 className={styles.loginTitle}>Recuperar Contraseña</h2>
                            <p className={styles.loginSubtitle}>Te enviaremos un enlace a tu correo</p>
                        </div>

                        <form className={styles.loginForm} onSubmit={handleSubmit}>
                            {error && (
                                <div className={styles.errorMessage}>
                                    <i className="bi bi-exclamation-circle"></i> {error}
                                </div>
                            )}
                            {message && (
                                <div style={{ backgroundColor: '#d1ecf1', color: '#0c5460', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                                    <i className="bi bi-check-circle"></i> {message}
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <i className="bi bi-envelope"></i> Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    className={styles.formInput}
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="bi bi-hourglass-split"></i> Enviando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send"></i> Enviar Enlace
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={styles.loginFooter}>
                            <p>
                                <Link href="/login" className={styles.registerLink}>
                                    Volver al inicio de sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
