"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase/client";

interface AnsweredQuestion {
  id: string;
  tracking_code: string;
  type: string;
  degree_plan: string | null;
  subject_name: string | null;
  semester: number;
  content: string;
  upvotes: number;
  answers: {
    content_markdown: string;
    created_at: string;
    profiles: {
      display_name: string;
      degree_plan: string;
      semester: number;
    } | null;
  }[];
}

export default function PreguntasRespondidasPage() {
  const [questions, setQuestions] = useState<AnsweredQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"todas" | "general" | "carrera">("todas");
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
        degree_plan,
        subject_name,
        semester,
        content,
        upvotes,
        answers (
          content_markdown,
          created_at,
          profiles (
            display_name,
            degree_plan,
            semester
          )
        )
      `)
      .eq("status", "answered")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setQuestions(data as unknown as AnsweredQuestion[]);
    }
    setLoading(false);
  };

  // Manejador del voto (Permite poner y quitar el "Me sirvió" de forma idempotente)
  const handleUpvote = async (questionId: string, currentUpvotes: number) => {
    const hasVoted = upvotedIds.includes(questionId);
    
    // Si ya votó, restamos 1; si no ha votado, sumamos 1
    const newCount = hasVoted ? Math.max(0, currentUpvotes - 1) : currentUpvotes + 1;

    const updatedUpvotedIds = hasVoted
      ? upvotedIds.filter((id) => id !== questionId)
      : [...upvotedIds, questionId];

    // Actualización inmediata en interfaz local
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, upvotes: newCount } : q))
    );

    setUpvotedIds(updatedUpvotedIds);
    localStorage.setItem("upvoted_questions", JSON.stringify(updatedUpvotedIds));

    // Guardado idempotente en Supabase
    await supabase
      .from("questions")
      .update({ upvotes: newCount })
      .eq("id", questionId);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesTab =
      selectedTab === "todas" ? true : q.type === selectedTab;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      q.content.toLowerCase().includes(query) ||
      (q.subject_name && q.subject_name.toLowerCase().includes(query)) ||
      (q.degree_plan && q.degree_plan.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Preguntas Respondidas</h1>
        <p className={styles.subtitle}>
          Consejos y respuestas de estudiantes avanzados de la FMAT UADY.
        </p>
      </header>

      <div className={styles.controls}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por palabra clave (ej. cálculo, inscripción, maestro)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${selectedTab === "todas" ? styles.tabActive : ""}`}
            onClick={() => setSelectedTab("todas")}
          >
            Todas
          </button>
          <button
            className={`${styles.tab} ${selectedTab === "general" ? styles.tabActive : ""}`}
            onClick={() => setSelectedTab("general")}
          >
            Generales (Campus)
          </button>
          <button
            className={`${styles.tab} ${selectedTab === "carrera" ? styles.tabActive : ""}`}
            onClick={() => setSelectedTab("carrera")}
          >
            De Carrera
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#64748b", padding: "2rem" }}>
          Cargando preguntas respondidas...
        </p>
      ) : filteredQuestions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 700, color: "#0f172a" }}>No se encontraron preguntas resueltas</p>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Intenta cambiando las palabras del buscador o publica la primera duda.</p>
        </div>
      ) : (
        <div className={styles.feed}>
          {filteredQuestions.map((q) => {
            const primaryAnswer = q.answers[0];
            const profile = primaryAnswer?.profiles;
            const hasVoted = upvotedIds.includes(q.id);

            return (
              <article key={q.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.tags}>
                    <span className={styles.tagCode}>#{q.tracking_code}</span>
                    <span className={styles.tag}>{q.type.toUpperCase()}</span>
                    {q.degree_plan && <span className={styles.tag}>{q.degree_plan}</span>}
                    {q.subject_name && <span className={styles.tag}>{q.subject_name}</span>}
                  </div>
                </div>

                {/* Se muestra el contenido exacto redactado por el alumno, sin signos añadidos */}
                <h2 className={styles.questionContent}>{q.content}</h2>

                {primaryAnswer && (
                  <div className={styles.answerBox}>
                    <ReactMarkdown>{primaryAnswer.content_markdown}</ReactMarkdown>
                  </div>
                )}

                <footer className={styles.responderMeta}>
                  <div>
                    Respondió:{" "}
                    <span className={styles.responderInfo}>
                      {profile ? `${profile.display_name} (${profile.degree_plan} - ${profile.semester}° sem)` : "Estudiante Avanzado"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleUpvote(q.id, q.upvotes)}
                    className={`${styles.upvoteButton} ${hasVoted ? styles.upvoted : ""}`}
                  >
                    👍 Me sirvió ({q.upvotes})
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}