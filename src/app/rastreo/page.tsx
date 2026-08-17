"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";

interface RastreoResult {
  id: string;
  tracking_code: string;
  content: string;
  status: "pending" | "answered" | "rejected";
  parent_question_id: string | null;
  answers: { content_markdown: string }[];
  parent_tracking_code: string | null;
}

function RastreoContent() {
  const searchParams = useSearchParams();
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RastreoResult | null>(null);

  const executeSearch = useCallback(async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    let cleanCode = codeToSearch.trim().toUpperCase();
    if (cleanCode.startsWith("#")) cleanCode = cleanCode.substring(1);
    if (cleanCode.startsWith("JAG-")) cleanCode = cleanCode.substring(4);
    else if (cleanCode.startsWith("JAG")) cleanCode = cleanCode.substring(3);
    cleanCode = cleanCode.replace(/-/g, "");

    const dbQueryCode = `JAG-${cleanCode}`;
    const uiDisplayCode = `#${dbQueryCode}`;

    try {
      // 1. Buscamos la pregunta cruda sin joins problemáticos
      const { data: qData, error: qError } = await supabase
        .from("questions")
        .select("id, tracking_code, content, status, parent_question_id")
        .eq("tracking_code", dbQueryCode)
        .maybeSingle();

      if (qError) throw qError;
      
      if (!qData) {
        setError("No pudimos encontrar una duda con ese código. Verifica que sea correcto.");
        setTrackingCode(uiDisplayCode);
        setLoading(false);
        return;
      }

      let finalAnswers: { content_markdown: string }[] = [];
      let finalParentCode: string | null = null;

      // 2. Lógica de separación de consultas directas
      if (qData.status === "answered") {
        if (qData.parent_question_id) {
          // Es hija: Buscamos el código del padre
          const { data: parentData } = await supabase
            .from("questions")
            .select("tracking_code")
            .eq("id", qData.parent_question_id)
            .maybeSingle();
            
          if (parentData) {
            finalParentCode = parentData.tracking_code;
          }
        } else {
          // Es padre/principal: Buscamos su respuesta principal
          const { data: ansData } = await supabase
            .from("answers")
            .select("content_markdown, is_annotation, created_at")
            .eq("question_id", qData.id);

          if (ansData && ansData.length > 0) {
            const sortedAnswers = [...ansData].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            const mainAns = sortedAnswers.find((a) => !a.is_annotation) || sortedAnswers[0];
            if (mainAns) {
              finalAnswers = [{ content_markdown: mainAns.content_markdown }];
            }
          }
        }
      }

      setResult({
        ...qData,
        answers: finalAnswers,
        parent_tracking_code: finalParentCode,
      } as RastreoResult);
      
      setTrackingCode(uiDisplayCode);

    } catch (err: any) {
      setError("Ocurrió un error al consultar la base de datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setTrackingCode(codeParam);
      executeSearch(codeParam);
    }
  }, [searchParams, executeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(trackingCode);
  };

  const isGrouped = !!result?.parent_question_id;
  const parentCode = result?.parent_tracking_code;

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
            disabled={loading}
          />
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={loading}
          >
            Buscar
          </button>
        </form>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </section>

      {/* Load Skeletons */}
      {loading && (
        <section className={styles.skeletonSection}>
          <div className={styles.skeletonBadge}></div>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonLine} style={{ width: "30%" }}></div>
            <div className={styles.skeletonLine} style={{ width: "100%" }}></div>
            <div className={styles.skeletonLine} style={{ width: "80%" }}></div>
          </div>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonLine} style={{ width: "20%" }}></div>
            <div className={styles.skeletonLine} style={{ width: "100%" }}></div>
            <div className={styles.skeletonLine} style={{ width: "100%" }}></div>
            <div className={styles.skeletonLine} style={{ width: "60%" }}></div>
          </div>
        </section>
      )}

      {/* Resultados Reales */}
      {!loading && result && (
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

          {/* Aviso si fue agrupada */}
          {result.status === 'answered' && isGrouped && parentCode && (
            <div className={styles.groupedNotice}>
              <p>Tu duda fue asociada a un grupo de varias preguntas similares. Busca este código en el buscador para ver la respuesta general:</p>
              <div className={styles.parentCodeBox}>#{parentCode}</div>
            </div>
          )}

          {/* Respuesta directa */}
          {result.status === 'answered' && !isGrouped && result.answers && result.answers.length > 0 && (
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

export default function RastreoPage() {
  return (
    <Suspense fallback={<p style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>Cargando buscador...</p>}>
      <RastreoContent />
    </Suspense>
  );
}