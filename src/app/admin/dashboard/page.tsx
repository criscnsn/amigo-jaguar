"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase/client";

interface Question {
  id: string;
  tracking_code: string;
  type: string;
  degree_plan: string | null;
  subject_name: string | null;
  semester: number;
  content: string;
  created_at: string;
  answers?: { content_markdown: string }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Estados para Filtros y Modal Bento Grid
  const [filterText, setFilterText] = useState("");
  const [groupModalFor, setGroupModalFor] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState("");
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setActiveUser(session.user);
      fetchQuestions();
    };

    checkAuth();
  }, [router]);

  const fetchQuestions = async () => {
    setLoading(true);
    // Cargar pendientes
    const { data: pending } = await supabase
      .from("questions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    // Cargar respondidas con su respuesta adjunta para la previsualización del Bento Grid
    const { data: answered } = await supabase
      .from("questions")
      .select(`
        id,
        tracking_code,
        type,
        degree_plan,
        subject_name,
        semester,
        content,
        created_at,
        answers ( content_markdown )
      `)
      .eq("status", "answered")
      .is("parent_question_id", null)
      .order("created_at", { ascending: false });

    if (pending) setPendingQuestions(pending);
    if (answered) setAnsweredQuestions(answered as unknown as Question[]);
    setLoading(false);
  };

  const handlePublishAnswer = async (questionId: string) => {
    const text = answerTexts[questionId];
    if (!text || !text.trim()) return;

    setSubmittingId(questionId);

    try {
      const { error: ansError } = await supabase.from("answers").insert([
        { question_id: questionId, responder_id: activeUser.id, content_markdown: text.trim() },
      ]);
      if (ansError) throw ansError;

      const { error: qError } = await supabase
        .from("questions")
        .update({ status: "answered" })
        .eq("id", questionId);
      if (qError) throw qError;

      setPendingQuestions((prev) => prev.filter((q) => q.id !== questionId));
      fetchQuestions();
    } catch (err: any) {
      alert("Error al publicar: " + err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleGroupSubmit = async () => {
    if (!groupModalFor || !selectedParentId) return;
    setSubmittingId(groupModalFor);

    try {
      const { error } = await supabase
        .from("questions")
        .update({ status: "answered", parent_question_id: selectedParentId })
        .eq("id", groupModalFor);

      if (error) throw error;

      setPendingQuestions((prev) => prev.filter((q) => q.id !== groupModalFor));
      setGroupModalFor(null);
      setSelectedParentId(null);
      setModalSearch("");
    } catch (err: any) {
      alert("Error al agrupar: " + err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const filteredPending = pendingQuestions.filter((q) => {
    const search = filterText.toLowerCase();
    return (
      q.content.toLowerCase().includes(search) ||
      q.tracking_code.toLowerCase().includes(search) ||
      (q.subject_name && q.subject_name.toLowerCase().includes(search)) ||
      (q.degree_plan && q.degree_plan.toLowerCase().includes(search))
    );
  });

  const filteredAnsweredForModal = answeredQuestions.filter((aq) => {
    const search = modalSearch.toLowerCase();
    return (
      aq.content.toLowerCase().includes(search) ||
      aq.tracking_code.toLowerCase().includes(search) ||
      (aq.subject_name && aq.subject_name.toLowerCase().includes(search))
    );
  });

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Cargando panel...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dudas Pendientes de Respuesta</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>Sesión activa: {activeUser?.email}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
      </header>

      <div className={styles.filterBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Filtra preguntas por código (JAG-XXXX), palabra clave o materia..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {filteredPending.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 700, color: "#166534" }}>No hay preguntas que coincidan.</p>
        </div>
      ) : (
        <div className={styles.questionList}>
          {filteredPending.map((q) => (
            <div key={q.id} className={styles.questionCard}>
              <div className={styles.questionMeta}>
                <span className={styles.tagCode}>#{q.tracking_code}</span>
                <span className={styles.tag}>{q.type.toUpperCase()}</span>
                {q.degree_plan && <span className={styles.tag}>{q.degree_plan}</span>}
                {q.subject_name && <span className={styles.tag}>{q.subject_name}</span>}
              </div>

              <p className={styles.questionContent}>{q.content}</p>

              <div className={styles.answerArea}>
                <textarea
                  className={styles.textarea}
                  placeholder="Escribe la respuesta principal aquí..."
                  value={answerTexts[q.id] || ""}
                  onChange={(e) => setAnswerTexts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                />
                
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => setGroupModalFor(q.id)}
                    className={styles.groupButton}
                  >
                    Vincular a duda ya respondida
                  </button>
                  <button
                    onClick={() => handlePublishAnswer(q.id)}
                    className={styles.publishButton}
                    disabled={submittingId === q.id}
                  >
                    {submittingId === q.id ? "Publicando..." : "Publicar Nueva Respuesta"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Bento Grid Interactivo para Agrupar */}
      {groupModalFor && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Vincular a Pregunta Existente</h2>
                <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                  Selecciona una tarjeta resuelta para fusionar esta duda bajo su respuesta.
                </p>
              </div>
              <button 
                onClick={() => { setGroupModalFor(null); setSelectedParentId(null); setModalSearch(""); }}
                className={styles.closeModalButton}
              >
                ✕
              </button>
            </div>

            {/* Buscador interno del modal */}
            <input
              type="text"
              className={styles.searchInput}
              style={{ marginBottom: "1rem" }}
              placeholder="Buscar en preguntas resueltas..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
            />

            {/* Bento Grid con Scroll Interno */}
            <div className={styles.bentoGridContainer}>
              {filteredAnsweredForModal.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b", padding: "2rem", fontSize: "0.875rem" }}>
                  No se encontraron preguntas resueltas con ese criterio.
                </p>
              ) : (
                <div className={styles.bentoGrid}>
                  {filteredAnsweredForModal.map((aq) => {
                    const isSelected = selectedParentId === aq.id;
                    const isExpanded = expandedPreviewId === aq.id;

                    return (
                      <div
                        key={aq.id}
                        className={`${styles.bentoCard} ${isSelected ? styles.bentoCardSelected : ""}`}
                        onClick={() => setSelectedParentId(aq.id)}
                      >
                        <div className={styles.bentoCardHeader}>
                          <span className={styles.tagCode}>#{aq.tracking_code}</span>
                          {aq.subject_name && <span className={styles.tag}>{aq.subject_name}</span>}
                        </div>

                        <p className={styles.bentoQuestionText}>{aq.content}</p>

                        <div className={styles.bentoCardFooter}>
                          <button
                            type="button"
                            className={styles.expandPreviewToggle}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPreviewId(isExpanded ? null : aq.id);
                            }}
                          >
                            {isExpanded ? "Ocultar respuesta" : "Previsualizar respuesta "}
                          </button>
                        </div>

                        {/* Acordeón de previsualización de la respuesta */}
                        {isExpanded && aq.answers && aq.answers[0] && (
                          <div className={styles.previewAnswerBox}>
                            <ReactMarkdown>{aq.answers[0].content_markdown}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.modalFooterActions}>
              <button 
                onClick={() => { setGroupModalFor(null); setSelectedParentId(null); setModalSearch(""); }} 
                className={styles.groupButton}
              >
                Cancelar
              </button>
              <button
                onClick={handleGroupSubmit}
                className={styles.publishButton}
                disabled={!selectedParentId || submittingId === groupModalFor}
              >
                {submittingId === groupModalFor ? "Vinculando..." : "Confirmar Vínculo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}