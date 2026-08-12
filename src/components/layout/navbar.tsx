"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, BookOpen, Search, Menu, X } from "lucide-react";
import styles from "./navbar.module.css";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo - Cierra el menú si se le da clic estando en móvil */}
        <Link href="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandBadge}>FMAT</span>
          <span>Amigo Jaguar</span>
        </Link>

        {/* Botón Hamburguesa (Solo visible en pantallas pequeñas) */}
        <button 
          className={styles.menuButton} 
          onClick={toggleMenu} 
          aria-label="Alternar menú"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navegación Desktop (Oculta en móvil) */}
        <nav className={styles.navLinksDesktop}>
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
          <Link href="/preguntas/nueva" className={styles.ctaButtonDesktop}>
            Hacer una pregunta
          </Link>
        </nav>
      </div>

      {/* Navegación Móvil (Se desliza hacia abajo) */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <nav className={styles.navLinksMobile}>
          <Link href="/preguntas" className={styles.navLinkMobile} onClick={closeMenu}>
            <HelpCircle size={20} />
            Preguntas
          </Link>
          <Link href="/rastreo" className={styles.navLinkMobile} onClick={closeMenu}>
            <Search size={20} />
            Rastrear Duda
          </Link>
          <Link href="/recursos" className={styles.navLinkMobile} onClick={closeMenu}>
            <BookOpen size={20} />
            Recursos y Croquis
          </Link>
          <Link href="/preguntas/nueva" className={styles.ctaButtonMobile} onClick={closeMenu}>
            Hacer una pregunta
          </Link>
        </nav>
      </div>
    </header>
  );
}