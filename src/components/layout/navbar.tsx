import Link from "next/link";
import { HelpCircle, BookOpen, Search } from "lucide-react";
import styles from "./navbar.module.css";

export function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandBadge}>FMAT</span>
          <span>Amigo Jaguar</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/preguntas" className={styles.navLink}>
            <HelpCircle size={16} />
            Preguntas
          </Link>
          <Link href="/rastreo" className={styles.navLink}>
            <Search size={16} />
            Rastrear Duda
          </Link>
          <Link href="/recursos" className={styles.navLink}>
            <BookOpen size={16} />
            Recursos y Croquis
          </Link>
        </nav>

        <Link href="/preguntas/nueva" className={styles.ctaButton}>
          Hacer una pregunta
        </Link>
      </div>
    </header>
  );
}