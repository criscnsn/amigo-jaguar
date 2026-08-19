"use client";

import styles from "../page.module.css";
import { Question } from "../_types/dashboard";

interface DeleteModalProps {
  question: Question | null;
  submittingId: string | null;
  onClose: () => void;
  onConfirmDelete: () => void;
}

/**
 * DeleteModal
 * Modal emergente de confirmación previa a la eliminación física de una pregunta en Supabase.
 */
export function DeleteModal({ question, submittingId, onClose, onConfirmDelete }: DeleteModalProps) {
  if (!question) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: "28rem" }}>
        <h2 className={styles.modalTitle} style={{ color: "#dc2626" }}>¿Eliminar esta pregunta?</h2>
        <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "1rem" }}>
          Estás a punto de borrar definitivamente la pregunta <strong>#{question.tracking_code}</strong> de la base de datos:
        </p>
        <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.875rem", borderRadius: "0.5rem", fontSize: "0.875rem", color: "#0f172a", marginBottom: "1.5rem" }}>
          "{question.content}"
        </div>
        <div className={styles.modalFooterActions}>
          <button onClick={onClose} className={styles.groupButton}>
            Cancelar
          </button>
          <button
            onClick={onConfirmDelete}
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              fontWeight: 800,
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8125rem",
            }}
            disabled={submittingId === question.id}
          >
            {submittingId === question.id ? "Eliminando..." : "Sí, Eliminar Definitivamente"}
          </button>
        </div>
      </div>
    </div>
  );
}