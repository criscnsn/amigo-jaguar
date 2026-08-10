"use client";

import { useState } from "react";
import Link from "next/link";
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

  // Estados de interfaz
  const [error, setError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
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

    // 3. Generación de código de rastreo (Simulación de envío previo a conectar Supabase)
    const trackingCode = generateTrackingCode();
    setSubmittedCode(trackingCode);
  };

  // Si la pregunta ya se envió con éxito, mostramos el código de rastreo
  if (submittedCode) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#166534" }}>
            ¡Tu pregunta fue enviada con éxito!
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#15803d", marginTop: "0.5rem" }}>
            Los estudiantes de semestres avanzados te responderán a la brevedad. Guarda este código para consultar el estado de tu duda:
          </p>

          <div className={styles.trackingCodeBox}>
            #{submittedCode}
          </div>

          <p style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "1.5rem" }}>
            No necesitas crear cuenta. Puedes buscar tu código en la sección "Rastrear Duda".
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={() => {
                setSubmittedCode(null);
                setContent("");
                setSelectedSubject("");
              }}
              style={{ padding: "0.75rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: 700 }}
            >
              Hacer otra pregunta
            </button>
            <Link
              href="/preguntas"
              style={{ padding: "0.75rem 1.25rem", borderRadius: "0.5rem", background: "#002e5f", color: "#fff", textDecoration: "none", fontWeight: 700 }}
            >
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
        <p className={styles.subtitle}>
          Tu duda será publicada de forma 100% anónima.
        </p>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* PASO 1: Tipo de Pregunta */}
          <div className={styles.formGroup}>
            <label className={styles.label}>1. ¿De qué trata tu duda?</label>
            <div className={styles.typeSelector}>
              <div
                className={`${styles.typeCard} ${questionType === "general" ? styles.typeCardActive : ""}`}
                onClick={() => setQuestionType("general")}
              >
                Duda General (Campus / Trámites)
              </div>
              <div
                className={`${styles.typeCard} ${questionType === "carrera" ? styles.typeCardActive : ""}`}
                onClick={() => setQuestionType("carrera")}
              >
                Duda de Carrera / Materias
              </div>
            </div>
          </div>

          {/* PASO 2: Selección de Carrera (Solo si es tipo Carrera) */}
          {questionType === "carrera" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Selecciona tu Carrera y Plan</label>
                <select
                  className={styles.select}
                  value={degreePlan}
                  onChange={(e) => {
                    setDegreePlan(e.target.value as DegreePlanId);
                    setSelectedSubject(""); // Reiniciar materia elegida al cambiar plan
                  }}
                >
                  {DEGREE_PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>¿Sobre qué es la duda?</label>
                <div className={styles.typeSelector}>
                  <div
                    className={`${styles.typeCard} ${category === "materias" ? styles.typeCardActive : ""}`}
                    onClick={() => setCategory("materias")}
                  >
                    Sobre una Materia
                  </div>
                  <div
                    className={`${styles.typeCard} ${category === "maestros" ? styles.typeCardActive : ""}`}
                    onClick={() => setCategory("maestros")}
                  >
                    Sobre Maestros
                  </div>
                </div>
              </div>

              {/* Si eligió Materias, desplegamos las materias filtradas del plan */}
              {category === "materias" && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Selecciona la Materia</label>
                  <select
                    className={styles.select}
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">-- Selecciona una asignatura --</option>
                    {SUBJECTS_BY_PLAN[degreePlan].map((subject, idx) => (
                      <option key={idx} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* PASO 3: Semestre del alumno */}
          <div className={styles.formGroup}>
            <label className={styles.label}>¿En qué semestre estás actualmente?</label>
            <select
              className={styles.select}
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
                <option key={sem} value={sem}>
                  {sem}° Semestre
                </option>
              ))}
            </select>
          </div>

          {/* PASO 4: Redacción de la duda */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Escribe tu duda en detalle</label>
            <textarea
              className={styles.textarea}
              placeholder="Ej. ¿Qué profesor recomiendan para cursar esta materia? o ¿A qué hora abren el área de cómputo?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError(null); // Limpia el error en cuanto el alumno vuelve a escribir
              }}
            />
          </div>

          {/* MENSAJE DE ERROR: Posicionado exactamente aquí para visibilidad inmediata */}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.submitButton}>
            Enviar Duda Anónima
          </button>
        </form>
      </div>
    </div>
  );
}