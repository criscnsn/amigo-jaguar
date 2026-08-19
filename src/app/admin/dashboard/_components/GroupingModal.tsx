"use client";

import ReactMarkdown from "react-markdown";
import styles from "../page.module.css";
import { Question } from "../_types/dashboard";

interface GroupingModalProps {
  groupModalForId: string | null;
  answeredQuestions: Question[];
  modalSearchText: string;
  setModalSearchText: (text: string) => void;
  selectedParentQuestion: Question | null;
  setSelectedParentQuestion: (q: Question) => void;
  unifiedParentTitle: string;
  setUnifiedParentTitle: (text: string) => void;
  expandedPreviewCardId: string | null;
  setExpandedPreviewCardId: (id: string | null) => void;
  submittingId: string | null;
  onClose: () => void;
  onConfirmGroup: () => void;
}

/**
 * GroupingModal
 * Presenta el Bento Grid interactivo con todas las dudas resueltas
 * para permitir la fusión/vinculación de preguntas bajo una misma respuesta.
 */
export function GroupingModal({
  groupModalForId,
  answeredQuestions,
  modalSearchText,
  setModalSearchText,
  selectedParentQuestion,
  setSelectedParentQuestion,
  unifiedParentTitle,
  setUnifiedParentTitle,
  expandedPreviewCardId,
  setExpandedPreviewCardId,
  submittingId,
  onClose,
  onConfirmGroup,
}: GroupingModalProps) {
  if (!groupModalForId) return null;

  const filteredAnswered = answeredQuestions.filter((aq) => {
    const search = modalSearchText.toLowerCase();
    return (
      aq.content.toLowerCase().includes(search) ||
      aq.tracking_code.toLowerCase().includes(search) ||
      (aq.subject_name && aq.subject_name.toLowerCase().includes(search))
    );
  });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Vincular y Unificar Preguntas</h2>
            <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: 0 }}>
              Selecciona la pregunta resuelta principal.
            </p>
          </div>
          <button onClick={onClose} className={styles.closeModalButton}>✕</button>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          style={{ marginBottom: "1rem" }}
          placeholder="Buscar en preguntas resueltas..."
          value={modalSearchText}
          onChange={(e) => setModalSearchText(e.target.value)}
        />

        {/* Bento Grid con Scroll Interno */}
        <div className={styles.bentoGridContainer}>
          {filteredAnswered.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b", padding: "2rem", fontSize: "0.875rem" }}>
              No se encontraron preguntas resueltas.
            </p>
          ) : (
            <div className={styles.bentoGrid}>
              {filteredAnswered.map((answeredQ) => {
                const isSelected = selectedParentQuestion?.id === answeredQ.id;
                const isExpanded = expandedPreviewCardId === answeredQ.id;

                const sortedAnsInModal = answeredQ.answers && answeredQ.answers.length > 0
                  ? [...answeredQ.answers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  : [];
                const mainAnswerObj = sortedAnsInModal.find((a) => !a.is_annotation) || sortedAnsInModal[0];

                return (
                  <div
                    key={answeredQ.id}
                    className={`${styles.bentoCard} ${isSelected ? styles.bentoCardSelected : ""}`}
                    onClick={() => {
                      setSelectedParentQuestion(answeredQ);
                      setUnifiedParentTitle(answeredQ.content);
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className={styles.tagCode}>#{answeredQ.tracking_code}</span>
                      {answeredQ.subject_name && <span className={styles.tagSubject}>{answeredQ.subject_name}</span>}
                    </div>

                    <p className={styles.bentoQuestionText}>{answeredQ.content}</p>

                    {mainAnswerObj && (
                      <div>
                        <button
                          type="button"
                          className={styles.previewToggle}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedPreviewCardId(isExpanded ? null : answeredQ.id);
                          }}
                        >
                          {isExpanded ? "Ocultar respuesta" : "Ver respuesta publicada"}
                        </button>

                        {isExpanded && (
                          <div className={styles.previewAnswerBox}>
                            <ReactMarkdown>{mainAnswerObj.content_markdown}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Campo opcional para definir el título unificado */}
        {selectedParentQuestion && (
          <div className={styles.editParentBox}>
            <label style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0369a1", display: "block", marginBottom: "0.25rem" }}>
              Título Unificado para la Sección Pública (opcional):
            </label>
            <input
              type="text"
              className={styles.editableTitleInput}
              value={unifiedParentTitle}
              onChange={(e) => setUnifiedParentTitle(e.target.value)}
            />
          </div>
        )}

        <div className={styles.modalFooterActions}>
          <button onClick={onClose} className={styles.groupButton}>
            Cancelar
          </button>
          <button
            onClick={onConfirmGroup}
            className={styles.publishButton}
            disabled={!selectedParentQuestion || submittingId === groupModalForId}
          >
            {submittingId === groupModalForId ? "Vinculando..." : "Confirmar Vínculo"}
          </button>
        </div>
      </div>
    </div>
  );
}