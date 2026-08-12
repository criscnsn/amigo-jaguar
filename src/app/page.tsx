"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HelpCircle, Search, Compass, MessageSquarePlus, ArrowRight } from "lucide-react";
import styles from "./page.module.css";

export default function HomePage() {
  const [trackingCode, setTrackingCode] = useState("");
  const router = useRouter();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      const cleanCode = trackingCode.trim().replace("#", "");
      router.push(`/rastreo?code=${cleanCode}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* 1. HERO DE BIENVENIDA */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Tus dudas de la FMAT, respondidas por estudiantes avanzados.
        </h1>
        <p className={styles.heroSubtitle}>
          Resuelve tus preguntas sobre maestros, materias, trámites y la facultad. 
          <br />
          100% anónimo y hecho por y para la comunidad FMAT. 
        </p>
      </section>

      {/* 2. TARJETAS DE ACCIÓN PRINCIPAL */}
      <section className={styles.actionsGrid}>
        {/* Tarjeta 1: Hacer pregunta */}
        <div className={`${styles.card} ${styles.cardPrimary}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrapper}>
              <MessageSquarePlus size={24} />
            </div>
          </div>
          <h2 className={styles.cardTitle}>Tengo una duda</h2>
          <p className={styles.cardDescription}>
            Publica tu pregunta sin necesidad de crear cuenta. Nadie sabrá quién eres.
          </p>
          <Link href="/preguntas/nueva" className={styles.btnPrimary}>
            Hacer pregunta anónima
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Tarjeta 2: Consultar resueltas */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrapperSec}>
              <HelpCircle size={24} />
            </div>
          </div>
          <h2 className={styles.cardTitle}>Ver dudas resueltas</h2>
          <p className={styles.cardDescription}>
            Explora las respuestas publicadas sobre materias, recomendaciones de profesores y la vida en FMAT.
          </p>
          <Link href="/preguntas" className={styles.btnSecondary}>
            Explorar respuestas
          </Link>
        </div>

        {/* Tarjeta 3: Rastrear código rápido */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrapperSec}>
              <Search size={24} />
            </div>
          </div>
          <h2 className={styles.cardTitle}>Rastrear mi pregunta</h2>
          <p className={styles.cardDescription}>
            ¿Ya mandaste una duda? Ingresa tu código único de 4 caracteres para ver si ya te respondieron.
          </p>
          <form onSubmit={handleTrackSubmit} className={styles.trackForm}>
            <div className={styles.trackInputGroup}>
              <span className={styles.hashPrefix}>#</span>
              <input
                type="text"
                placeholder="JAG-XXXX"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                maxLength={8}
                className={styles.trackInput}
              />
            </div>
            <button type="submit" className={styles.btnTrack}>
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* 3. TEASER DE RECURSOS */}
      <section className={styles.resourcesTeaser}>
        <div className={styles.teaserContent}>
          <div className={styles.teaserBadge}>
            <Compass size={15} /> Herramientas y Apoyos
          </div>
          <h3 className={styles.teaserTitle}>Croquis FMAT, Kiin y Convenios UADY</h3>
          <p className={styles.teaserText}>
            Ubicación de salones, el creador automático de horarios Kiin y beneficios para estudiantes FMAT.
          </p>
        </div>
        <Link href="/recursos" className={styles.teaserButton}>
          Ver Recursos
        </Link>
      </section>
    </div>
  );
}