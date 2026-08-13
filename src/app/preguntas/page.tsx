"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Search, HelpCircle, MessageSquare, ThumbsUp } from "lucide-react";
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
  grouped_questions: {
    id: string;
    tracking_code: string;
    content: string;
  }[];
}

// Lista curada de Preguntas Frecuentes para el carrusel superior
const FAQ_ITEMS = [
  {
    id: "faq-1",
    title: "Placeholder de titulo",
    category: "Placeholder de categoría",
    answer: "placeholder de respuesta."
  },
  {
    id: "faq-2",
    title: "¿Qué pasa si repruebo una materia en primer semestre?",
    category: "Académico",
    answer: "No entres en pánico. Tienes derecho a presentar examen extraordinario o recursar la asignatura en el siguiente periodo escolar en que se oferta. Revisa las fechas en el calendario académico FMAT."
  },
  {
    id: "faq-3",
    title: "¿Cómo solicito la carga máxima/mínima de créditos?",
    category: "Trámites",
    answer: "El trámite se realiza durante la semana de ajuste de carga con tu coordinador de carrera. Requieres contar con un promedio ponderado que respalde la solicitud."
  },
  {
    id: "faq-4",
    title: "¿Dónde consulto los convenios y descuentos UADY?",
    category: "Beneficios",
    answer: "Con tu credencial física o digital UADY tienes acceso a descuentos en transporte, librerías, museos y convenios deportivos. La lista completa se encuentra en la sección de Recursos."
  }
];

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

    return matchesTab && matchesSearch;
  });

  return (
    <div className={styles.wrapper}>
      {/* ENCABEZADO PRINCIPAL */}
      <header className={styles.header}>
        <h1 className={styles.title}>Preguntas y Respuestas</h1>
        <p className={styles.subtitle}>
          Consulta las respuestas redactadas por estudiantes avanzados de la FMAT.
        </p>
      </header>

      {/* 1. SECCIÓN: PREGUNTAS FRECUENTES (CARRUSEL HORIZONTAL) */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <HelpCircle size={20} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>
        </div>

        <div className={styles.faqCarousel}>
          {FAQ_ITEMS.map((faq) => (
            <article key={faq.id} className={styles.faqCard}>
              <span className={styles.faqCategory}>{faq.category}</span>
              <h3 className={styles.faqTitle}>{faq.title}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 2. CONTROLES DE BÚSQUEDA Y FILTRADO */}
      <section className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por palabra clave, materia o código (ej. JAG-XXXX, cálculo, maestro)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.tabsContainer}>
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
            Generales (Facultad)
          </button>
          <button
            className={`${styles.tab} ${selectedTab === "carrera" ? styles.tabActive : ""}`}
            onClick={() => setSelectedTab("carrera")}
          >
            De Carrera
          </button>
        </div>
      </section>

      {/* 3. SECCIÓN: PREGUNTAS DE LA COMUNIDAD (FEED VERTICAL) */}
      <section className={styles.communitySection}>
        <div className={styles.communityHeader}>
          <MessageSquare size={20} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Dudas de la Comunidad</h2>
        </div>

        {loading ? (
          <div className={styles.loadingBox}>
            <p>Cargando preguntas de la comunidad...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className={styles.emptyCard}>
            <p className={styles.emptyTitle}>No se encontraron preguntas resueltas</p>
            <p className={styles.emptySub}>
              Intenta con otras palabras clave en el buscador o publica una duda nueva.
            </p>
          </div>
        ) : (
          <div className={styles.feed}>
            {filteredQuestions.map((q) => {
              const primaryAnswer = q.answers && q.answers.length > 0 ? q.answers[0] : null;
              const profile = primaryAnswer?.profiles;
              const hasVoted = upvotedIds.includes(q.id);

              return (
                <article key={q.id} className={styles.questionCard}>
                  {/* Badges y Meta */}
                  <div className={styles.cardMetaHeader}>
                    <div className={styles.tagsGroup}>
                      <span className={styles.tagCode}>#{q.tracking_code}</span>
                      <span className={styles.tagType}>{q.type.toUpperCase()}</span>
                      {q.degree_plan && <span className={styles.tagPlan}>{q.degree_plan}</span>}
                      {q.subject_name && <span className={styles.tagSubject}>{q.subject_name}</span>}
                    </div>
                  </div>

                  {/* Texto de la pregunta */}
                  <h3 className={styles.questionContent}>{q.content}</h3>

                  {/* Preguntas agrupadas (Acordeón) */}
                  {q.grouped_questions && q.grouped_questions.length > 0 && (
                    <details className={styles.groupedAccordion}>
                      <summary className={styles.groupedSummary}>
                        Preguntas similares respondidas en esta sección ({q.grouped_questions.length})
                      </summary>
                      <ul className={styles.groupedList}>
                        {q.grouped_questions.map((gq) => (
                          <li key={gq.id} className={styles.groupedItem}>
                            <span className={styles.tagCode}>#{gq.tracking_code}</span>
                            <span className={styles.groupedText}>{gq.content}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {/* Caja de Respuesta Markdown */}
                  {primaryAnswer && (
                    <div className={styles.answerBox}>
                      <div className={styles.answerLabel}>Respuesta:</div>
                      <div className={styles.markdownContent}>
                        <ReactMarkdown>{primaryAnswer.content_markdown}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {/* Footer con información del respondedor y Votos */}
                  <footer className={styles.cardFooter}>
                    <div className={styles.responderInfo}>
                      Respondió:{" "}
                      <span className={styles.responderName}>
                        {profile
                          ? `${profile.display_name} (${profile.degree_plan} - ${profile.semester}° sem)`
                          : "Estudiante Avanzado"}
                      </span>
                    </div>

                    <button
                      onClick={() => handleUpvote(q.id, q.upvotes)}
                      className={`${styles.upvoteBtn} ${hasVoted ? styles.upvoted : ""}`}
                    >
                      <ThumbsUp size={15} />
                      Me sirvió ({q.upvotes})
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}