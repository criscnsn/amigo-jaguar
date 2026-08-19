"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase/client";

// Importación de tipos y componentes modularizados
import { Question, ToastMessage } from "./_types/dashboard";
import { ToastNotification } from "./_components/ToastNotification";
import { FilterBar } from "./_components/FilterBar";
import { QuestionCard } from "./_components/QuestionCard";
import { DeleteModal } from "./_components/DeleteModal";
import { GroupingModal } from "./_components/GroupingModal";
import { AdminSkeletons } from "./_components/AdminSkeletons";

export default function AdminDashboardPage() {
  const router = useRouter();

  // Estado de sesión y pestañas
  const [activeTab, setActiveTab] = useState<"pending" | "answered">("pending");
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeUser, setActiveUser] = useState<any>(null);

  // Sistema de alertas Toast
  const [toastNotification, setToastNotification] = useState<ToastMessage | null>(null);

  // Mapeo de respuestas y estados de subida
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Filtros de búsqueda
  const [filterSearchText, setFilterSearchText] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDegreePlan, setFilterDegreePlan] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");

  // Modales
  const [groupModalForId, setGroupModalForId] = useState<string | null>(null);
  const [selectedParentQuestion, setSelectedParentQuestion] = useState<Question | null>(null);
  const [unifiedParentTitle, setUnifiedParentTitle] = useState<string>("");
  const [modalSearchText, setModalSearchText] = useState<string>("");
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

    if (pending) setPendingQuestions(pending);
    if (answered) setAnsweredQuestions(answered as unknown as Question[]);

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

  return (
    <div className={styles.container}>
      {/* Toast Alertas */}
      <ToastNotification toast={toastNotification} />

      {/* Header */}
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

      {/* Pestañas de Navegación */}
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

      {/* Barra de Filtros */}
      <FilterBar
        searchText={filterSearchText}
        setSearchText={setFilterSearchText}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterDegreePlan={filterDegreePlan}
        setFilterDegreePlan={setFilterDegreePlan}
        filterSemester={filterSemester}
        setFilterSemester={setFilterSemester}
      />

      {/* Renderizado Condicional: Skeletons vs Lista */}
      {loading ? (
        <AdminSkeletons />
      ) : filteredQuestions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "0.875rem", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 700, color: "#166534" }}>No hay preguntas en esta sección que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className={styles.questionList}>
          {filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              activeTab={activeTab}
              answerText={answerTexts[question.id] || ""}
              setAnswerText={(text) => setAnswerTexts((prev) => ({ ...prev, [question.id]: text }))}
              submittingId={submittingId}
              onSaveAnswer={handleSaveAnswer}
              onOpenGroupModal={(qId) => setGroupModalForId(qId)}
              onOpenDeleteModal={(q) => setDeleteModalQuestion(q)}
            />
          ))}
        </div>
      )}

      {/* Modal Borrar */}
      <DeleteModal
        question={deleteModalQuestion}
        submittingId={submittingId}
        onClose={() => setDeleteModalQuestion(null)}
        onConfirmDelete={handleDeleteQuestion}
      />

      {/* Modal Vincular */}
      <GroupingModal
        groupModalForId={groupModalForId}
        answeredQuestions={answeredQuestions}
        modalSearchText={modalSearchText}
        setModalSearchText={setModalSearchText}
        selectedParentQuestion={selectedParentQuestion}
        setSelectedParentQuestion={setSelectedParentQuestion}
        unifiedParentTitle={unifiedParentTitle}
        setUnifiedParentTitle={setUnifiedParentTitle}
        expandedPreviewCardId={expandedPreviewCardId}
        setExpandedPreviewCardId={setExpandedPreviewCardId}
        submittingId={submittingId}
        onClose={closeGroupModal}
        onConfirmGroup={handleGroupSubmit}
      />
    </div>
  );
}