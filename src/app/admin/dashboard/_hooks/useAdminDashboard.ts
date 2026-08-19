"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Question, ToastMessage } from "../_types/dashboard";

/**
 * useAdminDashboard
 * Custom Hook que encapsula toda la lógica de estado, autenticación,
 * filtrado y operaciones de base de datos (Supabase) del panel de ayudadores.
 */
export function useAdminDashboard() {
  const router = useRouter();

  // Estados de sesión y pestañas
  const [activeTab, setActiveTab] = useState<"pending" | "answered">("pending");
  const [pendingQuestions, setPendingQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeUser, setActiveUser] = useState<any>(null);

  // Alertas
  const [toastNotification, setToastNotification] = useState<ToastMessage | null>(null);

  // Mapeo de respuestas e indicadores de carga
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Filtros
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

  const setAnswerText = (questionId: string, text: string) => {
    setAnswerTexts((prev) => ({ ...prev, [questionId]: text }));
  };

  // Filtrado compuesto según la pestaña activa
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

  return {
    // Estados
    activeTab,
    setActiveTab,
    pendingQuestionsCount: pendingQuestions.length,
    answeredQuestionsCount: answeredQuestions.length,
    answeredQuestions,
    loading,
    activeUser,
    toastNotification,
    answerTexts,
    setAnswerText,
    submittingId,
    filterSearchText,
    setFilterSearchText,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    filterDegreePlan,
    setFilterDegreePlan,
    filterSemester,
    setFilterSemester,
    groupModalForId,
    setGroupModalForId,
    selectedParentQuestion,
    setSelectedParentQuestion,
    unifiedParentTitle,
    setUnifiedParentTitle,
    modalSearchText,
    setModalSearchText,
    expandedPreviewCardId,
    setExpandedPreviewCardId,
    deleteModalQuestion,
    setDeleteModalQuestion,
    filteredQuestions,
    // Métodos
    handleSaveAnswer,
    handleDeleteQuestion,
    handleGroupSubmit,
    closeGroupModal,
    handleLogout,
  };
}