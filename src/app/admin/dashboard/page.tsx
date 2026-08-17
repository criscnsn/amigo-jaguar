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

  // Navegación por pestañas
  const [activeTab, setActiveTab] = useState<"pending" | "answered">("pending");

  // Estado general de preguntas y sesión
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<any>(null);

  // Banner de notificación personalizado (Cero popups de alerta)
  const [toastNotification, setToastNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Diccionarios de edición de texto
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Filtros de búsqueda
  const [filterSearchText, setFilterSearchText] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDegreePlan, setFilterDegreePlan] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");

  // Modal Bento Grid y previsualización
  const [groupModalForId, setGroupModalForId] = useState<string | null>(null);
  const [selectedParentQuestion, setSelectedParentQuestion] = useState<Question | null>(null);
  const [unifiedParentTitle, setUnifiedParentTitle] = useState("");
  const [modalSearchText, setModalSearchText] = useState("");
  const [expandedPreviewCardId, setExpandedPreviewCardId] = useState<string | null>(null);

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

    // 1. Cargar dudas pendientes
    const { data: pending } = await supabase
      .from("questions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    // 2. Cargar dudas resueltas principales
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

  // Guardar Respuesta (Principal o Anotación)
  const handleSaveAnswer = async (questionId: string, isAnnotation: boolean) => {
    const textContent = answerTexts[questionId];
    const newTitleContent = editedTitles[questionId];

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
        .update({ status: "answered"})
        .eq("id", questionId);

      if (qError) throw qError;

      showToast(
        isAnnotation ? "Anotación agregada con éxito." : "Respuesta actualizada correctamente."
      );
      setAnswerTexts((prev) => ({ ...prev, [questionId]: "" }));
      fetchQuestions();
    } catch (err: any) {
      showToast("Error al guardar: " + err.message, "error");
    } finally {
      setSubmittingId(null);
    }
  };

  // Vincular Duda a Pregunta Existente
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

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>Cargando panel de gestión...</div>;

  return (
    <div className={styles.container}>
      {/* BANNER DE NOTIFICACIÓN FLOTANTE */}
      {toastNotification && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 200,
            padding: "0.875rem 1.25rem",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "#ffffff",
            backgroundColor: toastNotification.type === "success" ? "#15803d" : "#dc2626",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {toastNotification.message}
        </div>
      )}

      {/* HEADER DE SESIÓN */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Ayudadores FMAT</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: 0 }}>
            Ayudador activo: {activeUser?.email}
          </p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      {/* PESTAÑAS DE NAVEGACIÓN */}
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

      {/* FILTROS DE BÚSQUEDA */}
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

      {/* LISTA DE TARJETAS DE DUDAS */}
      {filteredQuestions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "0.875rem", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 700, color: "#166534" }}>No hay preguntas en esta sección que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className={styles.questionList}>
          {filteredQuestions.map((question) => {
            // Ordenar respuestas de la más reciente a la más antigua
            const sortedAnswers = question.answers && question.answers.length > 0
              ? [...question.answers].sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
              : [];

            // Seleccionar la respuesta principal más reciente y las anotaciones
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

                {/* Mostrar Respuestas Existentes en la Pestaña de Resueltas (Siempre ordenadas por fecha) */}
                {activeTab === "answered" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                    {mainAns && (
                      <div style={{ backgroundColor: "#f8fafc", padding: "0.875rem", borderRadius: "0.5rem", borderLeft: "4px solid #10b981" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#047857", margin: "0 0 0.25rem 0" }}>
                          RESPUESTA PRINCIPAL ACTUAL:
                        </p>
                        <ReactMarkdown>{mainAns.content_markdown}</ReactMarkdown>
                      </div>
                    )}
                    {annList.map((ann) => (
                      <div key={ann.id} style={{ backgroundColor: "#fffbeb", padding: "0.875rem", borderRadius: "0.5rem", borderLeft: "4px solid #d97706" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#b45309", margin: "0 0 0.25rem 0" }}>
                          ANOTACIÓN REGISTRADA:
                        </p>
                        <ReactMarkdown>{ann.content_markdown}</ReactMarkdown>
                      </div>
                    ))}
                  </div>
                )}

                {/* ÁREA DE TEXTO Y ACCIONES DE RESPUESTA */}
                <div className={styles.answerArea}>
                  <textarea
                    className={styles.textarea}
                    placeholder={
                      activeTab === "pending"
                        ? "Puedes escribir la respuesta en Markdown"
                        : "Escribe un texto aquí para agregar una anotación o reemplazar la respuesta..."
                    }
                    value={answerTexts[question.id] || ""}
                    onChange={(e) => setAnswerTexts((prev) => ({ ...prev, [question.id]: e.target.value }))}
                  />

                  <div className={styles.actionButtons}>
                    {activeTab === "pending" && (
                      <button onClick={() => setGroupModalForId(question.id)} className={styles.groupButton}>
                        Vincular a duda ya respondida
                      </button>
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

      {/* MODAL BENTO GRID DE UNIFICACIÓN */}
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
                              {isExpanded ? "▲ Ocultar respuesta" : "▼ Ver respuesta publicada"}
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