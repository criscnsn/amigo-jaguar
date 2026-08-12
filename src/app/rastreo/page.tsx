"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";

// Interfaz temporal al no tener types/database.ts
interface RastreoResult {
  id: string;
  tracking_code: string;
  content: string;
  status: "pending" | "answered" | "rejected";
  answers?: { content_markdown: string }[];
}

export default function RastreoPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RastreoResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    // Normalización robusta del código ingresado
    let cleanCode = trackingCode.trim().toUpperCase();
    
    // Quitamos el '#' inicial si el usuario lo puso
    if (cleanCode.startsWith("#")) cleanCode = cleanCode.substring(1);
    
    // Quitamos prefijos completos o incompletos
    if (cleanCode.startsWith("JAG-")) cleanCode = cleanCode.substring(4);
    else if (cleanCode.startsWith("JAG")) cleanCode = cleanCode.substring(3);
    
    // Limpiamos cualquier guion extra que haya quedado
    cleanCode = cleanCode.replace(/-/g, "");

    // 1. Código para buscar en la Base de Datos (SIN el '#')
    const dbQueryCode = `JAG-${cleanCode}`;
    
    // 2. Código para mostrar bonito en la Interfaz (CON el '#')
    const uiDisplayCode = `#${dbQueryCode}`;

    try {
      // Usamos maybeSingle() para no lanzar un error en consola si no hay filas
      const { data, error: fetchError } = await supabase
        .from("questions")
        .select(`
          id,
          tracking_code,
          content,
          status,
          answers ( content_markdown )
        `)
        .eq("tracking_code", dbQueryCode)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      if (data) {
        setResult(data as unknown as RastreoResult);
        // Limpiamos el input para que muestre el código formateado visualmente
        setTrackingCode(uiDisplayCode);
      } else {
        setError("No pudimos encontrar una duda con ese código. Verifica que sea correcto.");
      }
    } catch (err: any) {
      setError("Ocurrió un error al consultar la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Rastrea tu duda</h1>
        <p className={styles.heroSubtitle}>
          Ingresa el código que se te proporcionó al hacer tu pregunta (ej. #JAG-4092) para conocer su estado o leer la respuesta.
        </p>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="#JAG-XXXX"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            className={styles.searchInput}
            maxLength={12}
            required
          />
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </section>

      {/* Resultados de la búsqueda */}
      {result && (
        <section className={styles.resultSection}>
          <div className={styles.statusBadge}>
            Estado: 
            <span className={styles[result.status]}>
              {result.status === 'pending' && ' En espera de respuesta'}
              {result.status === 'answered' && ' Respondida'}
              {result.status === 'rejected' && ' Rechazada'}
            </span>
          </div>

          <div className={styles.questionCard}>
            <h3 className={styles.cardLabel}>Tu pregunta:</h3>
            <p className={styles.questionText}>{result.content}</p>
          </div>

          {result.status === 'answered' && result.answers && result.answers.length > 0 && (
            <div className={styles.answerCard}>
              <h3 className={styles.cardLabel}>Respuesta:</h3>
              <div className={styles.markdownContent}>
                <ReactMarkdown>{result.answers[0].content_markdown}</ReactMarkdown>
              </div>
            </div>
          )}

          {result.status === 'pending' && (
            <div className={styles.pendingNotice}>
              Nuestros ayudadores aún están revisando tu duda. Vuelve a consultar más tarde.
            </div>
          )}
        </section>
      )}
    </div>
  );
}