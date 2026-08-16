export type QuestionType = "general" | "carrera";
export type GeneralCategory = "campus" | "tramites";
export type CareerCategory = "materias" | "maestros";
export type QuestionCategory = GeneralCategory | CareerCategory;

export type DegreePlanId =
  | "LIS_2016"
  | "LIS_2026"
  | "LIS_VIRTUAL"
  | "ACTUARIA_2014"
  | "ACTUARIA_2026"
  | "LCC_2016"
  | "LCC_2026"
  | "LEM_2013"
  | "LEM_2026"
  | "LM_2011"
  | "LM_2024"
  | "LIC_2013"
  | "LIC_2026";

export interface DegreePlan {
  id: DegreePlanId;
  label: string;
}

export const DEGREE_PLANS: DegreePlan[] = [
  { id: "LIS_2016", label: "Lic. en Ingeniería de Software (Plan 2016)" },
  { id: "LIS_2026", label: "Lic. en Ingeniería de Software (Plan 2026)" },
  { id: "LIS_VIRTUAL", label: "Lic. en Ingeniería de Software (Modalidad Virtual)" },
  { id: "ACTUARIA_2014", label: "Lic. en Actuaría (Plan 2014)" },
  { id: "ACTUARIA_2026", label: "Lic. en Actuaría (Plan 2026)" },
  { id: "LCC_2016", label: "Lic. en Ciencias de la Computación (Plan 2016)" },
  { id: "LCC_2026", label: "Lic. en Ciencias de la Computación (Plan 2026)" },
  { id: "LEM_2013", label: "Lic. en Enseñanza de las Matemáticas (Plan 2013)" },
  { id: "LEM_2026", label: "Lic. en Enseñanza de las Matemáticas (Plan 2026)" },
  { id: "LM_2011", label: "Lic. en Matemáticas (Plan 2011)" },
  { id: "LM_2024", label: "Lic. en Matemáticas (Plan 2024)" },
  { id: "LIC_2013", label: "Lic. en Ingeniería en Computación (Plan 2013)" },
  { id: "LIC_2026", label: "Lic. en Ingeniería en Computación (Plan 2026)" },
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
  LIS_VIRTUAL: [
    // Período 1
    "Álgebra Intermedia",
    "Fundamentos de Ingeniería de Software",
    "Responsabilidad Social Universitaria",
    // Período 2
    "Geometría Analítica",
    "Algoritmia",
    // Período 3
    "Álgebra Superior",
    "Matemáticas Discretas",
    "Cultura Maya",
    // Período 4
    "Cálculo Diferencial",
    "Programación Estructurada",
    // Período 5
    "Cálculo Integral",
    "Teoría de la Computación",
    "Arquitectura y Organización de Computadoras",
    // Período 6
    "Álgebra Lineal",
    "Programación Orientada a Objetos",
    // Período 7
    "Sistemas Operativos",
    "Teoría de Lenguajes de Programación",
    "Estructura de Datos",
    // Período 8
    "Probabilidad",
    "Diseño de Software",
    // Período 9
    "Inferencia Estadística",
    "Diseño de Bases de Datos",
    "Arquitecturas de Software",
    // Período 10
    "Construcción de Software",
    "Desarrollo de Aplicaciones Web",
    // Período 11
    "Métricas de Software",
    "Interacción Humano Computadora",
    "Taller de Emprendedores",
    // Período 12
    "Requisitos de Software",
    "Aseguramiento de la Calidad de Software",
    // Período 13
    "Verificación y Validación de Software",
    "Experimentación en Ingeniería de Software",
    // Período 14
    "Redes y Seguridad de Computadoras",
    "Innovación Tecnológica",
    // Período 15
    "Mantenimiento de Software",
    "Sistemas Distribuidos",
    // Período 16
    "Administración de Proyectos I",
    // Período 17
    "Administración de Proyectos II",
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
  LCC_2016: [
    // Primer Semestre
    "Álgebra Superior",
    "Geometría Analítica",
    "Algoritmia",
    "Álgebra Intermedia",
    "Responsabilidad Social Universitaria",
    // Segundo Semestre
    "Álgebra Avanzada",
    "Cálculo Diferencial",
    "Programación Estructurada",
    "Matemáticas Discretas",
    "Cultura Maya",
    // Tercer Semestre
    "Álgebra Lineal",
    "Cálculo Integral",
    "Estructuras de Datos",
    "Teoría de la Computación",
    // Cuarto Semestre
    "Arquitectura y Organización de Computadoras",
    "Cálculo Vectorial",
    "Programación Orientada a Objetos",
    "Análisis de Algoritmos",
    // Quinto Semestre
    "Probabilidad",
    "Ecuaciones Diferenciales",
    "Teoría de Lenguajes de Programación",
    "Modelado de Datos",
    // Sexto Semestre
    "Inferencia Estadística",
    "Sistemas Operativos",
    "Análisis y Diseño de Software",
    "Compiladores",
    "Taller de Emprendedores",
    // Séptimo Semestre
    "Metodología de la Investigación",
    "Métodos Numéricos",
    "Desarrollo y Mantenimiento de Software",
    "Redes de Computadoras",
    // Octavo Semestre
    "Cómputo Científico",
    "Sistemas Distribuidos",
    "Gestión de Tecnologías de la Información",
    // Noveno Semestre
    "Gráficas por Computadora",
    "Inteligencia Artificial",
    "Administración de Proyectos Tecnológicos",
  ],
  LCC_2026: [
    // Primer Semestre
    "Álgebra Universitaria",
    "Precálculo",
    "Lógica y Conjuntos",
    "Geometría Analítica y Trigonometría",
    "Fundamentos de Programación",
    // Segundo Semestre
    "Álgebra Lineal",
    "Cálculo Diferencial",
    "Matemáticas Discretas",
    "Programación Estructurada",
    // Tercer Semestre
    "Cálculo Integral",
    "Programación Orientada a Objetos",
    "Estructuras de Datos y Algoritmos",
    "Teoría de Autómatas y Lenguajes",
    // Cuarto Semestre
    "Probabilidad y Estadística",
    "Cálculo Avanzado",
    "Arquitectura y Organización de Computadoras",
    "Análisis de Algoritmos",
    "Bases de Datos Relacionales",
    // Quinto Semestre
    "Inferencia Estadística",
    "Sistemas Operativos",
    "Redes de Computadoras",
    "Ingeniería de Software",
    "Bases de Datos No Relacionales",
    "Fundamentos de Inteligencia Artificial",
    // Sexto Semestre
    "Métodos Numéricos",
    "Cómputo Distribuido y en la Nube",
    "Gráficas por Computadora",
    "Fundamentos de Ciberseguridad",
    "Ingeniería de Datos",
    "Aprendizaje Automático",
    // Séptimo Semestre
    "Cómputo de Alto Rendimiento",
    "Aprendizaje Profundo",
    "Ciberseguridad en Sistemas Operativos y Virtualización",
    "Visualización de Datos",
    // Octavo Semestre
    "Metodología de la Investigación e Innovación Computacional",
    "Procesamiento de Lenguaje Natural",
    "Visión Computacional",
    "Ciberseguridad en el Desarrollo de Aplicaciones",
  ],
  LEM_2013: [
    // Semestre 1
    "Álgebra Intermedia",
    "Didáctica del Álgebra",
    "Geometría Analítica I",
    "Geometría Euclidiana",
    "RSU",
    // Semestre 2
    "Álgebra Superior",
    "Didáctica de la Geometría",
    "Geometría Analítica II",
    "Lectura y Redacción Técnica",
    "Cultura Maya",
    // Semestre 3
    "Álgebra Lineal",
    "Cálculo Diferencial",
    "Informática Educativa",
    "Paradigmas Educativos",
    // Semestre 4
    "Didáctica del Cálculo",
    "Cálculo Integral",
    "Programación Específica",
    "Planeación y Evaluac Edu",
    // Semestre 5
    "Probabilidad",
    "Ecuaciones Diferenciales",
    "Entornos Virtuales de Aprendizaje",
    "Diseños de Aprendizaje",
    // Semestre 6
    "Inferencia Estadística",
    "Didáctica de la Prob y Est",
    "Laboratorio Didáctico",
    "Teorías en M E",
    // Semestre 7
    "Intro a la Invest en M E",
    // Semestre 8
    "Desarrollo de Emprendedores",
  ],
  LEM_2026: [
    // Semestre 1
    "Álgebra Universitaria",
    "Lógica y Conjuntos",
    "Geometría Plana y del Espacio",
    "Introducción al Cálculo",
    "Educación Socioemocional para la Docencia en Matemáticas",
    // Semestre 2
    "Álgebra Superior",
    "Trigonometría",
    "Geometría Analítica",
    "Currículo Matemático Escolar en el Sistema Educativo Mexicano",
    "Educación Inclusiva",
    // Semestre 3
    "Álgebra Lineal",
    "Cálculo Diferencial",
    "Didáctica de la Geometría",
    "Paradigmas Educativos",
    // Semestre 4
    "Cálculo Integral",
    "Didáctica del Álgebra",
    "Estrategias Didácticas",
    "Pensamiento Computacional y Matemáticas",
    // Semestre 5
    "Cálculo Multivariable",
    "Probabilidad",
    "Didáctica del Cálculo",
    "Evaluación para el Aprendizaje",
    "Programación Aplicada a la Enseñanza de las Matemáticas",
    // Semestre 6
    "Ecuaciones Diferenciales",
    "Inferencia Estadística",
    "Didáctica de la Probabilidad",
    "Planeación y Diseño de la Enseñanza",
    "Entornos Virtuales de Aprendizaje",
    // Semestre 7
    "Taller de Comunicación Didáctica",
    "Diseños de Cursos en Línea",
    // Semestre 8
    "Taller de Formación Docente",
  ],
  LM_2011: [
    // Semestre 1
    "Álgebra Intermedia",
    "Geometría Euclidiana",
    "Geometría Analítica I",
    // Semestre 2
    "Álgebra Superior I",
    "Cálculo I",
    "Geometría Analítica II",
    // Semestre 3
    "Álgebra Superior II",
    "Cálculo II",
    "Geometría Moderna",
    "Programación",
    // Semestre 4
    "Álgebra Lineal I",
    "Cálculo III",
    "Probabilidad",
    "Análisis Numérico",
    // Semestre 5
    "Álgebra Lineal II",
    "Cálculo Avanzado",
    "Inferencia Estadística",
    "Ecuaciones Diferenciales Ordinarias",
    // Semestre 6
    "Álgebra Abstracta I",
    "Análisis Matemático",
    "Taller de Prácticas Profesionales",
    // Semestre 7
    "Álgebra Abstracta II",
    "Teoría de la Medida e Integración",
    "Variable Compleja",
    // Semestre 8
    "Modelación Matemática",
    "Topología",
  ],
  LM_2024: [
    // Primer Semestre
    "Álgebra Universitaria",
    "Lógica y Conjuntos",
    "Introducción al Cálculo",
    "Geometría Analítica",
    "Matemáticas Discretas",
    "Ciudadanía y Cultura de Paz",
    // Segundo Semestre
    "Álgebra Superior",
    "Cálculo Diferencial",
    "Programación",
    "Software para Matemáticas",
    "Cultura Maya",
    // Tercer Semestre
    "Álgebra Lineal I",
    "Cálculo Integral",
    "Geometría Euclidiana",
    "Análisis Numérico",
    "Cultura Emprendedora",
    // Cuarto Semestre
    "Álgebra Lineal II",
    "Cálculo Multivariado",
    "Geometría Diferencial",
    "Probabilidad",
    // Quinto Semestre
    "Álgebra Abstracta",
    "Topología",
    "Análisis Real",
    "Inferencia Estadística",
    // Sexto Semestre
    "Variable Compleja",
    "Análisis Matemático",
    "Ecuaciones Diferenciales",
    "Métodos Estadísticos Aplicados",
    // Séptimo Semestre
    "Ciencia de Datos",
    "Métodos Estadísticos para Aprendizaje Automático",
    // Octavo Semestre
    "Modelación Matemática",
  ],
  LIC_2013: [
    // Semestre 1
    "Geometría Analítica",
    "Álgebra Intermedia",
    "Resp. Social Universitaria",
    "Desarrollo de Prototipos",
    "Fund. de Programación",
    // Semestre 2
    "Cálculo Diferencial",
    "Álgebra Lineal",
    "Cultura Maya",
    "Matemáticas Discretas",
    "Programación",
    // Semestre 3
    "Cálculo Integral",
    "Métodos Numéricos",
    "Física",
    "Teoría de la Computación",
    "Estructura de Datos",
    // Semestre 4
    "Cálculo Vectorial",
    "Probabilidad",
    "Electricidad y Magnetismo",
    "Software a Pequeña Escala",
    // Semestre 5
    "Ecuaciones Diferenciales",
    "Sistemas Digitales I",
    "Circuitos Electrónicos I",
    "Inteligencia Artificial",
    // Semestre 6
    "Señales y Sistemas",
    "Sistemas Digitales II",
    "Circuitos Electrónicos II",
    // Semestre 7
    "Redes de Computadoras",
    "Arquitectura de Comp.",
    "Sistemas Embebidos",
    // Semestre 8
    "Sistemas de Comunicación",
    "Sistemas Operativos",
    "Control Digital",
    // Semestre 9
    "Desarrollo de Emprendedores",
    "Sistemas de Tiempo Real",
  ],
  LIC_2026: [
    // Semestre 1
    "Precálculo",
    "Lógica y Conjuntos",
    "Álgebra Universitaria",
    "Fundamentos de Programación",
    "Geometría Analítica y Trigonometría",
    "Intro. a la Ing. en Computación",
    // Semestre 2
    "Cálculo Diferencial",
    "Matemáticas Discretas",
    "Álgebra Lineal",
    "Programación Estructurada",
    // Semestre 3
    "Cálculo Integral",
    "Métodos Numéricos",
    "Física",
    "Programación Orientada a Objetos",
    // Semestre 4
    "Sistemas Digitales",
    "Ecuaciones Diferenciales",
    "Electricidad y Magnetismo",
    "Estructuras de Datos y Algoritmos",
    "Probabilidad y Estadística",
    // Semestre 5
    "Arquitectura y Organización de Comp.",
    "Procesamiento de Señales",
    "Análisis de Circuitos Lineales",
    "Introducción al Aprendizaje Automático",
    "Medición e Instrumentación",
    // Semestre 6
    "Sistemas Operativos en Tiempo Real",
    "Sistemas de Control",
    "Dispositivos Electrónicos",
    "Aprendizaje Automático Avanzado",
    // Semestre 7
    "Redes de Computadoras",
    "Sistemas Embebidos",
    "Electrónica Analógica",
    // Semestre 8
    "Ciberseguridad",
    "Internet de las Cosas",
  ],
};