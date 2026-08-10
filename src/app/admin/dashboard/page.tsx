"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Verificar sesión activa
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setActiveUser(session.user);
      fetchPendingQuestions();
    };

    checkAuth();
  }, [router]);

  // 2. Cargar preguntas en estado 'pending'
  const fetchPendingQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setQuestions(data);
    }
    setLoading(false);
  };

  // 3. Publicar respuesta y marcar la duda como 'answered'
  const handlePublishAnswer = async (questionId: string) => {
    const text = answerTexts[questionId];
    if (!text || !text.trim()) return;

    setSubmittingId(questionId);

    try {
      // A. Insertar en tabla de respuestas
      const { error: ansError } = await supabase.from("answers").insert([
        {
          question_id: questionId,
          responder_id: activeUser.id,
          content_markdown: text.trim(),
        },
      ]);

      if (ansError) throw ansError;

      // B. Actualizar estado de la pregunta a 'answered'
      const { error: qError } = await supabase
        .from("questions")
        .update({ status: "answered" })
        .eq("id", questionId);

      if (qError) throw qError;

      // C. Remover la pregunta de la vista de pendientes
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err: any) {
      alert("Error al publicar la respuesta: " + err.message);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>Cargando panel de administración...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dudas Pendientes de Respuesta</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b" }}>
            Sesión activa: {activeUser?.email}
          </p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      {questions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 700, color: "#166534" }}>¡Excelente trabajo!</p>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>No hay preguntas pendientes de respuesta en este momento.</p>
        </div>
      ) : (
        <div className={styles.questionList}>
          {questions.map((q) => (
            <div key={q.id} className={styles.questionCard}>
              <div className={styles.questionMeta}>
                <span className={styles.tagCode}>#{q.tracking_code}</span>
                <span className={styles.tag}>{q.type.toUpperCase()}</span>
                {q.degree_plan && <span className={styles.tag}>{q.degree_plan}</span>}
                {q.subject_name && <span className={styles.tag}>{q.subject_name}</span>}
                <span className={styles.tag}>{q.semester}° Semestre</span>
              </div>

              <p className={styles.questionContent}>{q.content}</p>

              <div className={styles.answerArea}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1e293b" }}>
                  Escribe tu respuesta (Soporta formato Markdown):
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Escribe aquí los consejos sobre la materia, profesor o trámite..."
                  value={answerTexts[q.id] || ""}
                  onChange={(e) =>
                    setAnswerTexts((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                />
                <button
                  onClick={() => handlePublishAnswer(q.id)}
                  className={styles.publishButton}
                  disabled={submittingId === q.id}
                >
                  {submittingId === q.id ? "Publicando..." : "Publicar Respuesta"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}