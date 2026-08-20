"use client";

import { HelpCircle } from "lucide-react";
import styles from "../page.module.css";
import { FaqItem } from "../_types/questions";

// Preguntas frecuentes estáticas de acceso rápido[cite: 9]
const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    title: "Q placeholder",
    category: "Herramientas",
    answer: "a placeholder",
  },
  {
    id: "faq-2",
    title: "¿Qué pasa si repruebo una materia en primer semestre?",
    category: "Académico",
    answer: "No entres en pánico. Tienes derecho a presentar examen extraordinario o recursar la asignatura en el siguiente periodo escolar en que se oferta. Revisa las fechas en el calendario académico FMAT.",
  },
  {
    id: "faq-3",
    title: "¿Cómo solicito la carga máxima/mínima de créditos?",
    category: "Trámites",
    answer: "El trámite se realiza durante la semana de ajuste de carga con tu coordinador de carrera. Requieres contar con un promedio ponderado que respalde la solicitud.",
  },
  {
    id: "faq-4",
    title: "¿Dónde consulto los convenios y descuentos UADY?",
    category: "Beneficios",
    answer: "Con tu credencial física o digital UADY tienes acceso a descuentos en transporte, librerías, museos y convenios deportivos. La lista completa se encuentra en la sección de Recursos.",
  },
];

/**
 * FaqCarousel
 * Componente que renderiza el carrusel horizontal deslizable con tarjetas de preguntas frecuentes.
 */
export function FaqCarousel() {
  return (
    <section className={styles.faqSection}>
      <div className={styles.faqHeader}>
        <HelpCircle size={20} className={styles.sectionIcon} />
        <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
      </div>

      <div className={styles.faqCarousel}>
        {FAQ_ITEMS.map((faq) => (
          <article key={faq.id} className={styles.faqCard}>
            <span className={styles.faqCategory}>{faq.category}</span>
            <h3 className={styles.faqTitle}>{faq.title}</h3>
            <p className={styles.faqAnswer}>{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}