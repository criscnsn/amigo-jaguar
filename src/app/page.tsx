import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          ¿Tienes dudas sobre tu carrera o la facultad?
        </h1>
        
        <p className={styles.heroSubtitle}>
          Pregunta de forma 100% anónima. Estudiantes de semestres avanzados te orientaran con consejos reales sobre materias, profesores, trámites y cualquier duda que tengas.
        </p>
        
        <div className={styles.buttonGroup}>
          <Link href="/preguntas/nueva" className={styles.primaryButton}>
            Hacer una pregunta
          </Link>
          <Link href="/preguntas" className={styles.secondaryButton}>
            Explorar dudas respondidas
          </Link>
        </div>
      </section>
    </div>
  );
}