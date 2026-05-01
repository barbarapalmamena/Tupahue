'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../login/login.module.css';
import { actualizarPassword } from '@/lib/supabase';

export default function CambiarPasswordClient() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { error } = await actualizarPassword(password);

            if (error) {
                setError(error.message);
            } else {
                alert('¡Contraseña actualizada con éxito! Ahora puedes iniciar sesión con tu nueva clave.');
                router.push('/login');
            }
        } catch (err) {
            setError('Error al actualizar la contraseña');
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
                            <h2 className={styles.loginTitle}>Nueva Contraseña</h2>
                            <p className={styles.loginSubtitle}>Ingresa tu nueva clave de acceso</p>
                        </div>

                        <form className={styles.loginForm} onSubmit={handleSubmit}>
                            {error && (
                                <div className={styles.errorMessage}>
                                    <i className="bi bi-exclamation-circle"></i> {error}
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <i className="bi bi-lock"></i> Nueva Contraseña
                                </label>
                                <div className={styles.passwordContainer}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={styles.formInput}
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <i className="bi bi-lock-fill"></i> Confirmar Contraseña
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles.formInput}
                                    placeholder="Repite tu nueva clave"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                        <i className="bi bi-hourglass-split"></i> Actualizando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg"></i> Cambiar Contraseña
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
