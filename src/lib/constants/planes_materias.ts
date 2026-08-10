export type QuestionType = "general" | "carrera";
export type QuestionCategory = "maestros" | "materias";

export const DEGREE_PLANS = [
  { id: "LIS_2016", label: "Lic. en Ingeniería de Software (Plan 2016)" },
  { id: "ACTUARIA_2014", label: "Lic. en Actuaría (Plan 2014)" },
] as const;

export type DegreePlanId = typeof DEGREE_PLANS[number]["id"];

export const SUBJECTS_BY_PLAN: Record<DegreePlanId, string[]> = {
  LIS_2016: [
    // Primer Semestre
    "Geometría Analítica",
    "Álgebra Intermedia",
    "Algoritmia",
    "Fundamentos de Ingeniería de Software",
    "Responsabilidad Social Universitaria",
    // Segundo Semestre
    "Cálculo Diferencial",
    "Álgebra Superior",
    "Programación Estructurada",
    "Matemáticas Discretas",
    "Cultura Maya",
    // Tercer Semestre
    "Cálculo Integral",
    "Álgebra Lineal",
    "Programación Orientada a Objetos",
    "Teoría de la Computación",
    "Arquitectura y Organización de Computadoras",
    // Cuarto Semestre
    "Diseño de Software",
    "Probabilidad",
    "Estructuras de Datos",
    "Sistemas Operativos",
    "Teoría de Lenguajes de Programación",
    // Quinto Semestre
    "Inferencia Estadística",
    "Construcción de Software",
    "Diseño de Bases de Datos",
    "Desarrollo de Aplicaciones Web",
    // Sexto Semestre
    "Arquitecturas de Software",
    "Requisitos de Software",
    "Interacción Humano Computadora",
    "Métricas de Software",
    // Séptimo Semestre
    "Aseguramiento de la Calidad del Software",
    "Redes y Seguridad de Computadoras",
    "Innovación Tecnológica",
    "Experimentación en Ingeniería de Software",
    // Octavo Semestre
    "Verificación y Validación de Software",
    "Sistemas Distribuidos",
    "Administración de Proyectos I",
    // Noveno Semestre
    "Mantenimiento de Software",
    "Administración de Proyectos II",
    "Taller de Emprendedores",
  ],
  ACTUARIA_2014: [
    // Primer Semestre
    "Contabilidad Financiera",
    "Álgebra Superior I",
    "Geometría Analítica I",
    "Álgebra Intermedia",
    "Introducción al Cálculo",
    "Responsabilidad Social Universitaria",
    // Segundo Semestre
    "Sistemas Financieros",
    "Álgebra Superior II",
    "Introducción a la Administración de Riesgos",
    "Cálculo Univariable",
    "Cultura Maya",
    // Tercer Semestre
    "Matemáticas Financieras",
    "Álgebra Lineal",
    "Probabilidad I",
    "Cálculo Multivariable",
    "Microeconomía",
    // Cuarto Semestre
    "Valuación de Activos Financieros",
    "Inferencia Estadística",
    "Teoría del Seguro",
    "Probabilidad II",
    "Ecuaciones Diferenciales",
    "Macroeconomía",
    // Quinto Semestre
    "Programación",
    "Regresión Lineal",
    "Cálculo Actuarial para el Seguro de Vida I",
    "Procesos Estocásticos",
    "Investigación de Operaciones",
    "Estadística No Paramétrica",
    // Sexto Semestre
    "Herramientas Computacionales",
    "Introducción a la Seguridad Social",
    "Cálculo Actuarial para el Seguro de Vida II",
    "Demografía",
    "Métodos Numéricos",
    // Séptimo Semestre
    "Productos Derivados",
    "Seguridad Social y Pensiones Privadas",
    "Cálculo Actuarial para los Seguros No Vida",
    "Análisis de Supervivencia",
    "Portafolios de Inversión",
    // Octavo Semestre
    "Profesionalismo",
    "Técnicas de Muestreo",
    "Operación del Seguro",
    "Series de Tiempo",
    // Noveno Semestre
    "Solvencia y Basilea",
  ],
};