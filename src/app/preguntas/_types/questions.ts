/**
 * @file questions.ts
 * @description Tipos e interfaces para la sección pública de preguntas y respuestas.
 */

export interface Profile {
  display_name: string;
  degree_plan: string;
  semester: number;
}

export interface Answer {
  id: string;
  content_markdown: string;
  is_annotation: boolean;
  created_at: string;
  profiles: Profile | null;
}

export interface GroupedQuestion {
  id: string;
  tracking_code: string;
  content: string;
}

export interface AnsweredQuestion {
  id: string;
  tracking_code: string;
  type: "general" | "carrera";
  category: "campus" | "tramites" | "materias" | "maestros" | null; // Columna agregada
  degree_plan: string | null;
  subject_name: string | null;
  semester: number | null;
  content: string;
  upvotes: number;
  answers: Answer[];
  grouped_questions: GroupedQuestion[];
}

export interface FaqItem {
  id: string;
  title: string;
  category: string;
  answer: string;
}