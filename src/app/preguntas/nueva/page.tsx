"use client";

import { useState } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import styles from "./page.module.css";
import { 
  DEGREE_PLANS, 
  SUBJECTS_BY_PLAN, 
  DegreePlanId, 
  QuestionType, 
  GeneralCategory, 
  CareerCategory 
} from "@/lib/constants/planes_materias";
import { hasProfanity } from "@/lib/utils/profanity";
import { generateTrackingCode } from "@/lib/utils/tracking-code";

const MAX_CHAR_LIMIT = 320;

export default function NuevaPreguntaPage() {
  const [questionType, setQuestionType] = useState<QuestionType>("general");
  
  const [generalCategory, setGeneralCategory] = useState<GeneralCategory>("campus");
  const [careerCategory, setCareerCategory] = useState<CareerCategory>("materias");

  const [degreePlan, setDegreePlan] = useState<DegreePlanId>("LIS_2016");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [semester, setSemester] = useState<number>(1);
  const [content, setContent] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  // Cálculo para el anillo estilo Twitter
  const remainingChars = MAX_CHAR_LIMIT - content.length;
  const progressPercentage = Math.min((content.length / MAX_CHAR_LIMIT) * 100, 100);
  const circleRadius = 9;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progressPercentage / 100) * circleCircumference;

  // Color dinámico según la cercanía al límite
  const circleColor = 
    remainingChars <= 0 
      ? "#dc2626" 
      : remainingChars <= 40 
      ? "#d97706" 
      : "#002e5f";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Por favor escribe el detalle de tu duda.");
      return;
    }

    if (content.length > MAX_CHAR_LIMIT) {
      setError(`Tu pregunta excede el límite de ${MAX_CHAR_LIMIT} caracteres.`);
      return;
    }

    if (questionType === "carrera" && !selectedSubject) {
      setError("Por favor selecciona la materia correspondiente.");
      return;
    }

    if (hasProfanity(content)) {
      setError("Tu mensaje contiene palabras no permitidas. Por favor mantén un lenguaje respetuoso.");
      return;
    }

    if (!turnstileToken) {
      setError("Validación de seguridad en progreso. Espera un segundo y vuelve a intentar.");
      return;
    }

    setLoading(true);

    try {
      const trackingCode = generateTrackingCode();

      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turnstileToken,
          tracking_code: trackingCode,
          type: questionType,
          degree_plan: questionType === "carrera" ? degreePlan : null,
          category: questionType === "carrera" ? careerCategory : generalCategory,
          subject_name: questionType === "carrera" ? selectedSubject : null,
          semester: questionType === "carrera" ? semester : null,
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
                setTurnstileToken("");
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
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => setTurnstileToken(token)}
            options={{ theme: "light" }}
          />

          {/* PASO 1: Tipo de Pregunta */}
          <div className={styles.formGroup}>
            <label className={styles.label}>1. ¿De qué trata tu duda?</label>
            <div className={styles.typeSelector}>
              <div 
                className={`${styles.typeCard} ${questionType === "general" ? styles.typeCardActive : ""}`} 
                onClick={() => setQuestionType("general")}
              >
                Duda General
              </div>
              <div 
                className={`${styles.typeCard} ${questionType === "carrera" ? styles.typeCardActive : ""}`} 
                onClick={() => setQuestionType("carrera")}
              >
                Duda de Carrera / Materia
              </div>
            </div>
          </div>

          {/* PASO 2: Opciones para Dudas Generales */}
          {questionType === "general" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>2. Especificamente sobre:</label>
              <div className={styles.typeSelector}>
                <div 
                  className={`${styles.typeCard} ${generalCategory === "campus" ? styles.typeCardActive : ""}`}
                  onClick={() => setGeneralCategory("campus")}
                >
                  Campus / Instalaciones
                </div>
                <div 
                  className={`${styles.typeCard} ${generalCategory === "tramites" ? styles.typeCardActive : ""}`}
                  onClick={() => setGeneralCategory("tramites")}
                >
                  Trámites
                </div>
              </div>
            </div>
          )}

          {/* PASO 2 Y 3: Opciones para Dudas de Carrera */}
          {questionType === "carrera" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>2. Selecciona tu Carrera y Plan</label>
                <select 
                  className={styles.select} 
                  value={degreePlan} 
                  onChange={(e) => { 
                    setDegreePlan(e.target.value as DegreePlanId); 
                    setSelectedSubject(""); 
                  }}
                >
                  {DEGREE_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>3. ¿Qué deseas consultar?</label>
                <div className={styles.typeSelector}>
                  <div 
                    className={`${styles.typeCard} ${careerCategory === "materias" ? styles.typeCardActive : ""}`} 
                    onClick={() => setCareerCategory("materias")}
                  >
                    Sobre la Materia
                  </div>
                  <div 
                    className={`${styles.typeCard} ${careerCategory === "maestros" ? styles.typeCardActive : ""}`} 
                    onClick={() => setCareerCategory("maestros")}
                  >
                    Sobre Maestros de la Materia
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>4. Selecciona la Materia</label>
                <select 
                  className={styles.select} 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="">-- Selecciona una asignatura --</option>
                  {SUBJECTS_BY_PLAN[degreePlan].map((subject, idx) => (
                    <option key={idx} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>5. ¿En qué semestre estás actualmente?</label>
                <select 
                  className={styles.select} 
                  value={semester} 
                  onChange={(e) => setSemester(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
                    <option key={sem} value={sem}>{sem}° Semestre</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* REDACCIÓN DE LA DUDA + ANILLO DE CARACTERES */}
          <div className={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className={styles.label}>
                {questionType === "carrera" ? "6. Escribe tu duda en detalle" : "3. Escribe tu duda en detalle"}
              </label>

              {/* Indicador de límite estilo Twitter no le digan a elos musk plox*/}
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: circleColor }}>
                  {remainingChars}
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r={circleRadius}
                    stroke="#e2e8f0"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r={circleRadius}
                    stroke={circleColor}
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                      transition: "stroke-dashoffset 0.15s ease, stroke 0.15s ease",
                    }}
                  />
                </svg>
              </div>
            </div>

            <textarea
              className={styles.textarea}
              placeholder={
                questionType === "carrera"
                  ? careerCategory === "maestros"
                    ? "Ej. ¿Qué profesor recomiendan para esta materia y cuál es su método de evaluación?"
                    : "Ej. ¿Qué temas o conocimientos previos se necesitan para llevar esta materia?"
                  : "Ej. ¿Donde dan asesorias o dónde se pagan acompañamientos?"
              }
              value={content}
              maxLength={MAX_CHAR_LIMIT}
              onChange={(e) => { 
                setContent(e.target.value); 
                if (error) setError(null); 
              }}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.submitButton} disabled={loading || !turnstileToken}>
            {loading ? "Verificando y enviando..." : "Enviar Duda Anónima"}
          </button>
        </form>
      </div>
    </div>
  );
}