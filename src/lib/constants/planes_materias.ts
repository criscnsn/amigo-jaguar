export type QuestionType = "general" | "carrera";
export type QuestionCategory = "materias" | "maestros";

export type DegreePlanId = 
  | "LIS_2016" 
  | "LIS_2026" 
  | "ACTUARIA_2014" 
  | "ACTUARIA_2026";

export interface DegreePlan {
  id: DegreePlanId;
  label: string;
}

export const DEGREE_PLANS: DegreePlan[] = [
  { id: "LIS_2016", label: "Lic. en Ingeniería de Software (Plan 2016)" },
  { id: "LIS_2026", label: "Lic. en Ingeniería de Software (Plan 2026)" },
  { id: "ACTUARIA_2014", label: "Lic. en Actuaría (Plan 2014)" },
  { id: "ACTUARIA_2026", label: "Lic. en Actuaría (Plan 2026)" },
];

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
  LIS_2026: [
    // Primer Semestre
    "Álgebra Universitaria",
    "Fundamentos de Ingeniería de Software",
    "Fundamentos de Programación",
    "Geometría Analítica y Trigonometría",
    "Lógica y Conjuntos",
    "Precálculo",
    // Segundo Semestre
    "Álgebra Lineal",
    "Cálculo Diferencial",
    "Matemáticas Discretas",
    "Programación Estructurada",
    "Teoría de la Computación",
    // Tercer Semestre
    "Cálculo Integral",
    "Programación Orientada a Objetos",
    "Sistemas Operativos",
    "Teoría de Lenguajes de Programación",
    // Cuarto Semestre
    "Diseño de Software",
    "Estructuras de Datos y Algoritmos",
    "Interacción Humano Computadora",
    "Probabilidad y Estadística",
    "Redes de Computadoras",
    // Quinto Semestre
    "Arquitecturas de Software",
    "Bases de Datos",
    "Construcción de Software",
    "Interfaces Web Interactivas",
    "Requisitos de Software",
    // Sexto Semestre
    "Administración de la Calidad del Software",
    "Cómputo Distribuido y en la Nube",
    "Desarrollo de Aplicaciones Móviles",
    "Desarrollo de Aplicaciones Web",
    "Métricas de Software",
    // Séptimo Semestre
    "Administración de Proyectos I",
    "Aseguramiento de la Calidad del Software",
    "Integración y Entrega Continua",
    "Mantenimiento de Software",
    "Seguridad en Software",
    // Octavo Semestre
    "Administración de Proyectos II",
    "Emprendimiento e Innovación",
    "Experimentación en Ingeniería de Software",
    "Ingeniería de Software para Sistemas con IA",
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
  ACTUARIA_2026: [
    // Primer Semestre
    "Álgebra Superior I",
    "Contabilidad Financiera",
    "Geometría Analítica",
    "Herramientas Computacionales",
    "Introducción al Cálculo",
    // Segundo Semestre
    "Álgebra Superior II",
    "Cálculo Univariable",
    "Programación para Actuaría",
    "Sistemas Financieros",
    // Tercer Semestre
    "Álgebra Lineal",
    "Cálculo Multivariable",
    "Matemáticas Financieras",
    "Microeconomía",
    "Probabilidad I",
    // Cuarto Semestre
    "Finanzas Corporativas",
    "Inferencia Estadística",
    "Introducción a la Ciencia de Datos",
    "Macroeconomía",
    "Probabilidad II",
    "Teoría del Seguro",
    // Quinto Semestre
    "Cálculo Actuarial para Seguros de Vida I",
    "Métodos Numéricos para Actuaría",
    "Modelos Estocásticos",
    "Modelos Lineales",
    "Valuación de Activos Financieros",
    // Sexto Semestre
    "Administración",
    "Aprendizaje Automático I",
    "Cálculo Actuarial para Seguros de Vida II",
    "Gestión de Portafolios y Derivados",
    "Modelos de Supervivencia",
    // Séptimo Semestre
    "Aprendizaje Automático II",
    "Cálculo Actuarial para Seguros No Vida",
    "Seguridad Social",
    "Series de Tiempo",
    // Octavo Semestre
    "Administración de Riesgos",
    "Operación del Seguro",
    "Pensiones y Otros Beneficios para Empleados",
    "Profesionalismo",
  ],
};