/**
 * @file dashboard.ts
 * @description Definición de tipos e interfaces utilizadas en el panel de administración/ayudadores.
 */

export interface Answer {
  id: string;
  content_markdown: string;
  is_annotation: boolean;
  created_at: string;
}

export interface Question {
  id: string;
  tracking_code: string;
  type: "general" | "carrera";
  category: "campus" | "tramites" | "materias" | "maestros" | null;
  degree_plan: string | null;
  subject_name: string | null;
  semester: number | null;
  content: string;
  created_at: string;
  answers?: Answer[];
}

export interface ToastMessage {
  message: string;
  type: "success" | "error";
}