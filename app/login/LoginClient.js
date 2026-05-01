'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './login.module.css';

export default function LoginClient() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                const { data, error } = await signIn(email, password, rememberMe);
                if (error) {
                    setError(error.message);
                } else {
                    router.push('/biblioteca');
                }
            } else {
                const { data, error } = await signUp(email, password, nombre);
                if (error) {
                    setError(error.message);
                } else {
                    setSuccess('¡Cuenta creada! Revisa tu email para confirmar.');
                }
            }
        } catch (err) {
            setError('Error inesperado. Intenta de nuevo.');
        }

        setLoading(false);
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <h2 className={styles.loginTitle}>
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>

                    {error && <div className={styles.alertError}>{error}</div>}
                    {success && <div className={styles.alertSuccess}>{success}</div>}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nombre</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contraseña</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        {isLogin && (
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe">Recordarme</label>
                            </div>
                        )}

                        <button type="submit" className={styles.btnSubmit} disabled={loading}>
                            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        </button>
                    </form>

                    <p className={styles.toggleText}>
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        <button className={styles.toggleBtn} onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}>
                            {isLogin ? ' Regístrate' : ' Inicia Sesión'}
                        </button>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
