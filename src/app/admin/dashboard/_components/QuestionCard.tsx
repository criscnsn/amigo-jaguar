"use client";

import ReactMarkdown from "react-markdown";
import styles from "../page.module.css";
import { Question } from "../_types/dashboard";

interface QuestionCardProps {
  question: Question;
  activeTab: "pending" | "answered";
  answerText: string;
  setAnswerText: (text: string) => void;
  submittingId: string | null;
  onSaveAnswer: (questionId: string, isAnnotation: boolean) => void;
  onOpenGroupModal: (questionId: string) => void;
  onOpenDeleteModal: (question: Question) => void;
}

/**
 * QuestionCard
 * Muestra el contenido de una duda individual, metadatos (badges), respuestas registradas
 * y el área de edición/respuesta para los ayudadores.
 */
export function QuestionCard({
  question,
  activeTab,
  answerText,
  setAnswerText,
  submittingId,
  onSaveAnswer,
  onOpenGroupModal,
  onOpenDeleteModal,
}: QuestionCardProps) {
  // Ordenar respuestas de la más reciente a la más antigua
  const sortedAnswers = question.answers && question.answers.length > 0
    ? [...question.answers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : [];

  // La respuesta principal actual será la más reciente que NO sea una anotación
  const mainAns = sortedAnswers.find((a) => !a.is_annotation) || sortedAnswers[0];
  const annList = sortedAnswers.filter((a) => a.is_annotation);

  return (
    <article className={styles.questionCard}>
      {/* Badges de Metadatos */}
      <div className={styles.questionMeta}>
        <span className={styles.tagCode}>#{question.tracking_code}</span>
        <span className={styles.tagType}>{question.type.toUpperCase()}</span>
        {question.category && <span className={styles.tagCategory}>{question.category.toUpperCase()}</span>}
        {question.degree_plan && <span className={styles.tagPlan}>{question.degree_plan}</span>}
        {question.subject_name && <span className={styles.tagSubject}>{question.subject_name}</span>}
        {question.semester && <span className={styles.tagPlan}>{question.semester}° Semestre</span>}
      </div>

      {/* Redacción del Alumno (Texto estático para preservar la versión original) */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.25rem" }}>
          Pregunta del alumno:
        </label>
        <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.4 }}>
          {question.content}
        </p>
      </div>

      {/* En pestaña "Resueltas": Muestra el historial ordenado de respuesta principal y anotaciones */}
      {activeTab === "answered" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          {mainAns && (
            <div style={{ backgroundColor: "#f8fafc", padding: "0.875rem", borderRadius: "0.5rem", borderLeft: "4px solid #10b981" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#047857", margin: "0 0 0.25rem 0" }}>RESPUESTA PRINCIPAL ACTUAL:</p>
              <ReactMarkdown>{mainAns.content_markdown}</ReactMarkdown>
            </div>
          )}
          {annList.map((ann) => (
            <div key={ann.id} style={{ backgroundColor: "#fffbeb", padding: "0.875rem", borderRadius: "0.5rem", borderLeft: "4px solid #d97706" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#b45309", margin: "0 0 0.25rem 0" }}>ANOTACIÓN REGISTRADA:</p>
              <ReactMarkdown>{ann.content_markdown}</ReactMarkdown>
            </div>
          ))}
        </div>
      )}

      {/* Áreas de Captura y Botones de Acción */}
      <div className={styles.answerArea}>
        <textarea
          className={styles.textarea}
          placeholder={
            activeTab === "pending"
              ? "Escribe la respuesta en Markdown..."
              : "Escribe un texto aquí para agregar una anotación o reemplazar la respuesta..."
          }
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />

        <div className={styles.actionButtons}>
          {activeTab === "pending" && (
            <>
              <button
                onClick={() => onOpenDeleteModal(question)}
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  fontWeight: 700,
                  padding: "0.625rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                }}
              >
                Borrar Pregunta
              </button>
              <button onClick={() => onOpenGroupModal(question.id)} className={styles.groupButton}>
                Vincular a duda ya respondida
              </button>
            </>
          )}

          {activeTab === "answered" && (
            <button
              onClick={() => onSaveAnswer(question.id, true)}
              className={styles.groupButton}
              disabled={submittingId === question.id}
            >
              Agregar Anotación / Corrección
            </button>
          )}

          <button
            onClick={() => onSaveAnswer(question.id, false)}
            className={styles.publishButton}
            disabled={submittingId === question.id}
          >
            {submittingId === question.id
              ? "Guardando..."
              : activeTab === "pending"
              ? "Publicar Respuesta"
              : "Reemplazar Respuesta Principal"}
          </button>
        </div>
      </div>
    </article>
  );
}