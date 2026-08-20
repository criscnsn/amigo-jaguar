"use client";

import ReactMarkdown from "react-markdown";
import { ThumbsUp, AlertCircle } from "lucide-react";
import styles from "../page.module.css";
import { AnsweredQuestion } from "../_types/questions";

interface QuestionFeedCardProps {
  question: AnsweredQuestion;
  isUpvoted: boolean;
  onUpvote: (questionId: string, currentUpvotes: number) => void;
}

/**
 * QuestionFeedCard
 * Muestra las respuestas con la lista completa de metadatos (tipo, categoría, carrera y materia).
 */
export function QuestionFeedCard({ question, isUpvoted, onUpvote }: QuestionFeedCardProps) {
  const sortedAnswers = [...(question.answers || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const mainAnswer = sortedAnswers.find((ans) => !ans.is_annotation) || sortedAnswers[0];
  const annotations = sortedAnswers.filter((ans) => ans.is_annotation);
  const profile = mainAnswer?.profiles;

  return (
    <article className={styles.questionCard}>
      {/* Badges y Etiquetas Completas */}
      <div className={styles.cardMetaHeader}>
        <div className={styles.tagsGroup}>
          <span className={styles.tagCode}>#{question.tracking_code}</span>
          <span className={styles.tagType}>{question.type.toUpperCase()}</span>
          {question.category && <span className={styles.tagCategory}>{question.category.toUpperCase()}</span>}
          {question.degree_plan && <span className={styles.tagPlan}>{question.degree_plan}</span>}
          {question.subject_name && <span className={styles.tagSubject}>{question.subject_name}</span>}
          {question.semester && <span className={styles.tagPlan}>{question.semester}° Semestre</span>}
        </div>
      </div>

      <h3 className={styles.questionContent}>{question.content}</h3>

      {/* Preguntas agrupadas */}
      {question.grouped_questions && question.grouped_questions.length > 0 && (
        <details className={styles.groupedAccordion}>
          <summary className={styles.groupedSummary}>
            Preguntas similares respondidas en esta sección ({question.grouped_questions.length})
          </summary>
          <ul className={styles.groupedList}>
            {question.grouped_questions.map((gq) => (
              <li key={gq.id} className={styles.groupedItem}>
                <span className={styles.tagCode}>#{gq.tracking_code}</span>
                <span className={styles.groupedText}>{gq.content}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Respuesta Principal */}
      {mainAnswer && (
        <div className={styles.answerBox}>
          <div className={styles.answerLabel}>Respuesta Principal:</div>
          <div className={styles.markdownContent}>
            <ReactMarkdown>{mainAnswer.content_markdown}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Anotaciones */}
      {annotations.length > 0 && (
        <div className={styles.annotationsWrapper}>
          {annotations.map((ann) => (
            <div key={ann.id} className={styles.annotationBox}>
              <div className={styles.annotationBadge}>
                <AlertCircle size={14} /> Anotación / Actualización posterior:
              </div>
              <div className={styles.markdownContent}>
                <ReactMarkdown>{ann.content_markdown}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className={styles.cardFooter}>
        <div className={styles.responderInfo}>
          Respondió:{" "}
          <span className={styles.responderName}>
            {profile
              ? `${profile.display_name} (${profile.degree_plan} - ${profile.semester}° sem)`
              : "Estudiante Avanzado"}
          </span>
        </div>
        {/* Botón de votaciones */}
        <button
          onClick={() => onUpvote(question.id, question.upvotes)}
          className={`${styles.upvoteBtn} ${isUpvoted ? styles.upvoted : ""}`}
        >
          <ThumbsUp size={15} />
          Me sirvió ({question.upvotes})
        </button>
      </footer>
    </article>
  );
}