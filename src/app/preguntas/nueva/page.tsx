"use client";

import { useState } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import styles from "./page.module.css";
import { DEGREE_PLANS, SUBJECTS_BY_PLAN, DegreePlanId, QuestionType, QuestionCategory } from "@/lib/constants/planes_materias";
import { hasProfanity } from "@/lib/utils/profanity";
import { generateTrackingCode } from "@/lib/utils/tracking-code";

export default function NuevaPreguntaPage() {
  // Estado del árbol de decisión
  const [questionType, setQuestionType] = useState<QuestionType>("general");
  const [degreePlan, setDegreePlan] = useState<DegreePlanId>("LIS_2016");
  const [semester, setSemester] = useState<number>(1);
  const [category, setCategory] = useState<QuestionCategory>("materias");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // Estados de interfaz y carga
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validaciones básicas de presencia
    if (!content.trim()) {
      setError("Por favor escribe el detalle de tu duda.");
      return;
    }

    if (questionType === "carrera" && category === "materias" && !selectedSubject) {
      setError("Por favor selecciona la materia sobre la que deseas preguntar.");
      return;
    }

    // 2. Validación de filtro anti-groserías
    if (hasProfanity(content)) {
      setError("Tu mensaje contiene palabras o expresiones no permitidas. Por favor mantén un lenguaje respetuoso.");
      return;
    }

    if (!turnstileToken) {
      setError("Validación de seguridad en progreso. Por favor espera un segundo y vuelve a intentar.");
      return;
    }

    setLoading(true);

    try {
      const trackingCode = generateTrackingCode();

      // Enviar datos + Token a nuestra ruta segura del servidor
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          tracking_code: trackingCode,
          type: questionType,
          degree_plan: questionType === "carrera" ? degreePlan : null,
          category: questionType === "carrera" ? category : null,
          subject_name: questionType === "carrera" && category === "materias" ? selectedSubject : null,
          semester: semester,
          content: content.trim(),
          status: "pending",
          upvotes: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error al enviar la duda.");
      }

      setSubmittedCode(trackingCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Si la pregunta ya se envió con éxito, mostramos el código de rastreo
  if (submittedCode) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#166534" }}>¡Tu pregunta fue enviada con éxito!</h2>
          <p style={{ fontSize: "0.875rem", color: "#15803d", marginTop: "0.5rem" }}>
            Los estudiantes de semestres avanzados te responderán a la brevedad. Guarda este código para consultar el estado de tu duda:
          </p>
          <div className={styles.trackingCodeBox}>#{submittedCode}</div>
          <p style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "1.5rem" }}>
            No necesitas crear cuenta. Puedes buscar tu código en la sección "Rastrear Duda".
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={() => {
                setSubmittedCode(null);
                setContent("");
                setSelectedSubject("");
                setTurnstileToken(""); // Resetear token para la nueva pregunta
              }}
              style={{ padding: "0.75rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: 700 }}
            >
              Hacer otra pregunta
            </button>
            <Link href="/preguntas" style={{ padding: "0.75rem 1.25rem", borderRadius: "0.5rem", background: "#002e5f", color: "#fff", textDecoration: "none", fontWeight: 700 }}>
              Ir a Preguntas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Hacer una pregunta</h1>
        <p className={styles.subtitle}>Tu duda será publicada de forma 100% anónima.</p>

        <form onSubmit={handleSubmit}>
          {/* El widget de Turnstile en modo invisible */}
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => setTurnstileToken(token)}
            options={{ theme: "light" }}
          />

          {/* PASO 1: Tipo de Pregunta */}
          <div className={styles.formGroup}>
            <label className={styles.label}>1. ¿De qué trata tu duda?</label>
            <div className={styles.typeSelector}>
              <div className={`${styles.typeCard} ${questionType === "general" ? styles.typeCardActive : ""}`} onClick={() => setQuestionType("general")}>
                Duda General (Campus / Trámites)
              </div>
              <div className={`${styles.typeCard} ${questionType === "carrera" ? styles.typeCardActive : ""}`} onClick={() => setQuestionType("carrera")}>
                Duda de Carrera / Materias
              </div>
            </div>
          </div>

          {/* PASO 2: Selección de Carrera */}
          {questionType === "carrera" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Selecciona tu Carrera y Plan</label>
                <select className={styles.select} value={degreePlan} onChange={(e) => { setDegreePlan(e.target.value as DegreePlanId); setSelectedSubject(""); }}>
                  {DEGREE_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>¿Sobre qué es la duda?</label>
                <div className={styles.typeSelector}>
                  <div className={`${styles.typeCard} ${category === "materias" ? styles.typeCardActive : ""}`} onClick={() => setCategory("materias")}>Sobre una Materia</div>
                  <div className={`${styles.typeCard} ${category === "maestros" ? styles.typeCardActive : ""}`} onClick={() => setCategory("maestros")}>Sobre Maestros</div>
                </div>
              </div>

              {category === "materias" && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Selecciona la Materia</label>
                  <select className={styles.select} value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">-- Selecciona una asignatura --</option>
                    {SUBJECTS_BY_PLAN[degreePlan].map((subject, idx) => (
                      <option key={idx} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* PASO 3 y 4: Semestre y Redacción */}
          <div className={styles.formGroup}>
            <label className={styles.label}>¿En qué semestre estás actualmente?</label>
            <select className={styles.select} value={semester} onChange={(e) => setSemester(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
                <option key={sem} value={sem}>{sem}° Semestre</option>
              ))}
            </select>
          </div>

          {/* PASO 4: Redacción de la duda */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Escribe tu duda en detalle</label>
            <textarea
              className={styles.textarea}
              placeholder="Ej. ¿Qué profesor recomiendan para cursar esta materia?"
              value={content}
              onChange={(e) => { setContent(e.target.value); if (error) setError(null); }}
            />
          </div>

          {/* Error de validación o base de datos */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading || !turnstileToken}>
            {loading ? "Verificando y enviando..." : "Enviar Duda Anónima"}
          </button>
        </form>
      </div>
    </div>
  );
}