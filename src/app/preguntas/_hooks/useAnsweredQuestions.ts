"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AnsweredQuestion } from "../_types/questions";

/**
 * useAnsweredQuestions
 * Hook que administra la carga, votación y filtrado inteligente de dudas resueltas.
 */
export function useAnsweredQuestions() {
  const [questions, setQuestions] = useState<AnsweredQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"todas" | "general" | "carrera">("todas");
  
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDegreePlan, setFilterDegreePlan] = useState<string>("all");
  const [filterSemester, setFilterSemester] = useState<string>("all");

  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAnsweredQuestions();
    const savedUpvotes = JSON.parse(localStorage.getItem("upvoted_questions") || "[]");
    setUpvotedIds(savedUpvotes);
  }, []);

  const fetchAnsweredQuestions = async () => {
    setLoading(true);

    const { data, error } = await supabase
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
        upvotes,
        answers (
          id,
          content_markdown,
          is_annotation,
          created_at,
          profiles (
            display_name,
            degree_plan,
            semester
          )
        ),
        grouped_questions:questions!parent_question_id (
          id,
          tracking_code,
          content
        )
      `)
      .eq("status", "answered")
      .is("parent_question_id", null)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuestions(data as unknown as AnsweredQuestion[]);
    }
    setLoading(false);
  };

  const handleUpvote = async (questionId: string, currentUpvotes: number) => {
    const hasVoted = upvotedIds.includes(questionId);
    const newCount = hasVoted ? Math.max(0, currentUpvotes - 1) : currentUpvotes + 1;
    const updatedUpvotedIds = hasVoted
      ? upvotedIds.filter((id) => id !== questionId)
      : [...upvotedIds, questionId];

    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, upvotes: newCount } : q))
    );

    setUpvotedIds(updatedUpvotedIds);
    localStorage.setItem("upvoted_questions", JSON.stringify(updatedUpvotedIds));

    await supabase.from("questions").update({ upvotes: newCount }).eq("id", questionId);
  };

  const resetSubFilters = () => {
    setFilterCategory("all");
    setFilterDegreePlan("all");
    setFilterSemester("all");
  };

  // Filtrado compuesto e inteligente
  const filteredQuestions = questions.filter((q) => {
    const matchesTab = selectedTab === "todas" ? true : q.type === selectedTab;
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      q.content.toLowerCase().includes(query) ||
      (q.subject_name && q.subject_name.toLowerCase().includes(query)) ||
      (q.degree_plan && q.degree_plan.toLowerCase().includes(query)) ||
      (q.grouped_questions &&
        q.grouped_questions.some(
          (gq) =>
            gq.content.toLowerCase().includes(query) ||
            gq.tracking_code.toLowerCase().includes(query)
        ));

    const matchesCategory = filterCategory === "all" || q.category === filterCategory;

    // Los filtros de plan y semestre solo evalúan si la pregunta es de tipo 'carrera'
    const matchesDegreePlan =
      filterDegreePlan === "all" || (q.type === "carrera" && q.degree_plan === filterDegreePlan);

    const matchesSemester =
      filterSemester === "all" || (q.type === "carrera" && String(q.semester) === filterSemester);

    return matchesTab && matchesSearch && matchesCategory && matchesDegreePlan && matchesSemester;
  });

  return {
    loading,
    searchQuery,
    setSearchQuery,
    selectedTab,
    setSelectedTab,
    filterCategory,
    setFilterCategory,
    filterDegreePlan,
    setFilterDegreePlan,
    filterSemester,
    setFilterSemester,
    resetSubFilters,
    filteredQuestions,
    upvotedIds,
    handleUpvote,
  };
}