"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase/client";
import { DEGREE_PLANS } from "@/lib/constants/planes_materias";

interface Question {
  id: string;
  tracking_code: string;
  type: "general" | "carrera";
  category: "campus" | "tramites" | "materias" | "maestros" | null;
  degree_plan: string | null;
  subject_name: string | null;
  semester: number | null;
  content: string;
  created_at: string;
  answers?: { id: string; content_markdown: string; is_annotation: boolean; created_at: string }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"pending" | "answered">("pending");
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<any>(null);

  const [toastNotification, setToastNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const [filterSearchText, setFilterSearchText] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDegreePlan, setFilterDegreePlan] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");

  const [groupModalForId, setGroupModalForId] = useState<string | null>(null);
  const [selectedParentQuestion, setSelectedParentQuestion] = useState<Question | null>(null);
  const [unifiedParentTitle, setUnifiedParentTitle] = useState("");
  const [modalSearchText, setModalSearchText] = useState("");
  const [expandedPreviewCardId, setExpandedPreviewCardId] = useState<string | null>(null);

  const [deleteModalQuestion, setDeleteModalQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setActiveUser(session.user);
      fetchQuestions();
    };

    checkAuthAndFetch();
  }, [router]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 4000);
  };

  const fetchQuestions = async () => {
    setLoading(true);

    const { data: pending } = await supabase
      .from("questions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    const { data: answered } = await supabase
      .from("questions")
      .select(`
        id,
        tracking_code,
        type,
        category,
        degree_plan,
        subject_name,
        semester,
        content,
        created_at,
        answers ( id, content_markdown, is_annotation, created_at )
      `)
      .eq("status", "answered")
      .is("parent_question_id", null)
      .order("created_at", { ascending: false });

    if (pending) {
      setPendingQuestions(pending);
      const initialTitles: Record<string, string> = {};
      pending.forEach((q) => { initialTitles[q.id] = q.content; });
      setEditedTitles(initialTitles);
    }

    if (answered) {
      setAnsweredQuestions(answered as unknown as Question[]);
    }

    setLoading(false);
  };

  const handleSaveAnswer = async (questionId: string, isAnnotation: boolean) => {
    const textContent = answerTexts[questionId];
    if (!textContent || !textContent.trim()) {
      showToast("Escribe un texto antes de enviar.", "error");
      return;
    }

    setSubmittingId(questionId);

    try {
      const { error: ansError } = await supabase.from("answers").insert([
        {
          question_id: questionId,
          responder_id: activeUser.id,
          content_markdown: textContent.trim(),
          is_annotation: isAnnotation,
        },
      ]);
      if (ansError) throw ansError;

      const { error: qError } = await supabase
        .from("questions")
        .update({ status: "answered" })
        .eq("id", questionId);

      if (qError) throw qError;

      showToast(isAnnotation ? "Anotación agregada con éxito." : "Respuesta actualizada correctamente.");
      setAnswerTexts((prev) => ({ ...prev, [questionId]: "" }));
      fetchQuestions();
    } catch (err: any) {
      showToast("Error al guardar: " + err.message, "error");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!deleteModalQuestion) return;

    setSubmittingId(deleteModalQuestion.id);

    try {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", deleteModalQuestion.id)
        .eq("status", "pending");

      if (error) throw error;

      showToast(`Pregunta #${deleteModalQuestion.tracking_code} eliminada con éxito.`);
      setPendingQuestions((prev) => prev.filter((q) => q.id !== deleteModalQuestion.id));
      setDeleteModalQuestion(null);
    } catch (err: any) {
      showToast("Error al eliminar la pregunta: " + err.message, "error");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleGroupSubmit = async () => {
    if (!groupModalForId || !selectedParentQuestion) return;

    setSubmittingId(groupModalForId);

    try {
      if (unifiedParentTitle.trim() !== selectedParentQuestion.content) {
        const { error: updateParentErr } = await supabase
          .from("questions")
          .update({ content: unifiedParentTitle.trim() })
          .eq("id", selectedParentQuestion.id);

        if (updateParentErr) throw updateParentErr;
      }

      const { error: linkErr } = await supabase
        .from("questions")
        .update({ status: "answered", parent_question_id: selectedParentQuestion.id })
        .eq("id", groupModalForId);

      if (linkErr) throw linkErr;

      showToast("Duda vinculada con éxito.");
      setPendingQuestions((prev) => prev.filter((q) => q.id !== groupModalForId));
      closeGroupModal();
      fetchQuestions();
    } catch (err: any) {
      showToast("Error al agrupar la duda: " + err.message, "error");
    } finally {
      setSubmittingId(null);
    }
  };

  const closeGroupModal = () => {
    setGroupModalForId(null);
    setSelectedParentQuestion(null);
    setUnifiedParentTitle("");
    setModalSearchText("");
    setExpandedPreviewCardId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const currentList = activeTab === "pending" ? pendingQuestions : answeredQuestions;

  const filteredQuestions = currentList.filter((q) => {
    const search = filterSearchText.toLowerCase();

    const matchesText =
      q.content.toLowerCase().includes(search) ||
      q.tracking_code.toLowerCase().includes(search) ||
      (q.subject_name && q.subject_name.toLowerCase().includes(search));

    const matchesType = filterType === "all" || q.type === filterType;
    const matchesCategory = filterCategory === "all" || q.category === filterCategory;
    const matchesDegreePlan = filterDegreePlan === "all" || q.degree_plan === filterDegreePlan;
    const matchesSemester = filterSemester === "all" || String(q.semester) === filterSemester;

    return matchesText && matchesType && matchesCategory && matchesDegreePlan && matchesSemester;
  });

  const filteredAnsweredForModal = answeredQuestions.filter((aq) => {
    const search = modalSearchText.toLowerCase();
    return (
      aq.content.toLowerCase().includes(search) ||
      aq.tracking_code.toLowerCase().includes(search) ||
      (aq.subject_name && aq.subject_name.toLowerCase().includes(search))
    );
  });

  return (
    <div className={styles.container}>
      {toastNotification && (
        <div
          style={{
            position: "fixed",
            top: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
            padding: "0.875rem 1.75rem",
            borderRadius: "0.625rem",
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: "#ffffff",
            backgroundColor: toastNotification.type === "success" ? "#15803d" : "#dc2626",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
            textAlign: "center",
            minWidth: "280px",
          }}
        >
          {toastNotification.message}
        </div>
      )}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Ayudadores FMAT</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: 0 }}>
            Ayudador activo: {activeUser?.email || "Cargando..."}
          </p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === "pending" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Dudas Pendientes ({pendingQuestions.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "answered" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("answered")}
        >
          Dudas Resueltas / Editar ({answeredQuestions.length})
        </button>
      </div>

      <section className={styles.filterContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por código (#JAG-XXXX), palabra clave o materia..."
          value={filterSearchText}
          onChange={(e) => setFilterSearchText(e.target.value)}
        />

        <div className={styles.filterGrid}>
          <select className={styles.filterSelect} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Todos los Tipos</option>
            <option value="general">Generales</option>
            <option value="carrera">De Carrera</option>
          </select>

          <select className={styles.filterSelect} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">Todas las Categorías</option>
            <option value="campus">Campus</option>
            <option value="tramites">Trámites</option>
            <option value="materias">Materias</option>
            <option value="maestros">Maestros</option>
          </select>

          <select className={styles.filterSelect} value={filterDegreePlan} onChange={(e) => setFilterDegreePlan(e.target.value)}>
            <option value="all">Todas las Carreras</option>
            {DEGREE_PLANS.map((plan) => (
              <option key={plan.id} value={plan.id}>{plan.label}</option>
            ))}
          </select>

          <select className={styles.filterSelect} value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
            <option value="all">Todos los Semestres</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
              <option key={sem} value={String(sem)}>{sem}° Semestre</option>
            ))}
          </select>
        </div>
      </section>

      {/* RENDERIZADO CON SKELETONS DE CARGA */}
      {loading ? (
        <div className={styles.skeletonSection}>
          {[1, 2, 3].map((index) => (
            <div key={index} className={styles.skeletonCard}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <div className={styles.skeletonLine} style={{ width: "80px" }}></div>
                <div className={styles.skeletonLine} style={{ width: "100px" }}></div>
                <div className={styles.skeletonLine} style={{ width: "120px" }}></div>
              </div>
              <div className={styles.skeletonLine} style={{ width: "65%", height: "1.25rem" }}></div>
              <div className={styles.skeletonLine} style={{ width: "100%", height: "4.5rem" }}></div>
            </div>
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "0.875rem", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 700, color: "#166534" }}>No hay preguntas en esta sección que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className={styles.questionList}>
          {filteredQuestions.map((question) => {
            const sortedAnswers = question.answers && question.answers.length > 0
              ? [...question.answers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              : [];

            const mainAns = sortedAnswers.find((a) => !a.is_annotation) || sortedAnswers[0];
            const annList = sortedAnswers.filter((a) => a.is_annotation);

            return (
              <article key={question.id} className={styles.questionCard}>
                <div className={styles.questionMeta}>
                  <span className={styles.tagCode}>#{question.tracking_code}</span>
                  <span className={styles.tagType}>{question.type.toUpperCase()}</span>
                  {question.category && <span className={styles.tagCategory}>{question.category.toUpperCase()}</span>}
                  {question.degree_plan && <span className={styles.tagPlan}>{question.degree_plan}</span>}
                  {question.subject_name && <span className={styles.tagSubject}>{question.subject_name}</span>}
                  {question.semester && <span className={styles.tagPlan}>{question.semester}° Semestre</span>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.25rem" }}>
                    Pregunta del alumno:
                  </label>
                  <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.4 }}>
                    {question.content}
                  </p>
                </div>

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

                <div className={styles.answerArea}>
                  <textarea
                    className={styles.textarea}
                    placeholder={
                      activeTab === "pending"
                        ? "Escribe la respuesta en Markdown..."
                        : "Escribe un texto aquí para agregar una anotación o reemplazar la respuesta..."
                    }
                    value={answerTexts[question.id] || ""}
                    onChange={(e) => setAnswerTexts((prev) => ({ ...prev, [question.id]: e.target.value }))}
                  />

                  <div className={styles.actionButtons}>
                    {activeTab === "pending" && (
                      <>
                        <button
                          onClick={() => setDeleteModalQuestion(question)}
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
                        <button onClick={() => setGroupModalForId(question.id)} className={styles.groupButton}>
                          Vincular a duda ya respondida
                        </button>
                      </>
                    )}

                    {activeTab === "answered" && (
                      <button
                        onClick={() => handleSaveAnswer(question.id, true)}
                        className={styles.groupButton}
                        disabled={submittingId === question.id}
                      >
                        Agregar Anotación / Corrección
                      </button>
                    )}

                    <button
                      onClick={() => handleSaveAnswer(question.id, false)}
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
          })}
        </div>
      )}

      {/* MODAL BORRAR PREGUNTA */}
      {deleteModalQuestion && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: "28rem" }}>
            <h2 className={styles.modalTitle} style={{ color: "#dc2626" }}>¿Eliminar esta pregunta?</h2>
            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5, marginBottom: "1rem" }}>
              Estás a punto de borrar definitivamente la pregunta <strong>#{deleteModalQuestion.tracking_code}</strong> de la base de datos:
            </p>
            <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.875rem", borderRadius: "0.5rem", fontSize: "0.875rem", color: "#0f172a", marginBottom: "1.5rem" }}>
              "{deleteModalQuestion.content}"
            </div>
            <div className={styles.modalFooterActions}>
              <button onClick={() => setDeleteModalQuestion(null)} className={styles.groupButton}>
                Cancelar
              </button>
              <button
                onClick={handleDeleteQuestion}
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
                disabled={submittingId === deleteModalQuestion.id}
              >
                {submittingId === deleteModalQuestion.id ? "Eliminando..." : "Sí, Eliminar Definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VINCULAR PREGUNTA */}
      {groupModalForId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Vincular y Unificar Preguntas</h2>
                <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: 0 }}>
                  Selecciona la pregunta resuelta principal.
                </p>
              </div>
              <button onClick={closeGroupModal} className={styles.closeModalButton}>✕</button>
            </div>

            <input
              type="text"
              className={styles.searchInput}
              style={{ marginBottom: "1rem" }}
              placeholder="Buscar en preguntas resueltas..."
              value={modalSearchText}
              onChange={(e) => setModalSearchText(e.target.value)}
            />

            <div className={styles.bentoGridContainer}>
              {filteredAnsweredForModal.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "2rem", fontSize: "0.875rem" }}>
                  No se encontraron preguntas resueltas.
                </p>
              ) : (
                <div className={styles.bentoGrid}>
                  {filteredAnsweredForModal.map((answeredQ) => {
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
              <button onClick={closeGroupModal} className={styles.groupButton}>
                Cancelar
              </button>
              <button
                onClick={handleGroupSubmit}
                className={styles.publishButton}
                disabled={!selectedParentQuestion || submittingId === groupModalForId}
              >
                {submittingId === groupModalForId ? "Vinculando..." : "Confirmar Vínculo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}