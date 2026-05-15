import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './article.module.css';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Para que se actualice siempre

async function getArticle(id) {
    const { data, error } = await supabase
        .from('articulos')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !data) return null;
    return data;
}

export default async function ArticlePage({ params }) {
    const article = await getArticle(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            
            <main className={styles.main}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <div className={styles.meta}>
                            {new Date(article.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            <span className={styles.separator}>•</span>
                            <span className={styles.author}>{article.autor || 'Iglesia Tupahue'}</span>
                        </div>
                        <h1 className={styles.title}>{article.titulo}</h1>
                    </header>

                    <div 
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: article.contenido }}
                    />

                    <div className={styles.footer}>
                        <a href="/" className={styles.backBtn}>
                            <i className="bi bi-arrow-left"></i> Volver al Inicio
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
