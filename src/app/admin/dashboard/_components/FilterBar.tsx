"use client";

import styles from "../page.module.css";
import { DEGREE_PLANS } from "@/lib/constants/planes_materias";

interface FilterBarProps {
  searchText: string;
  setSearchText: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  filterDegreePlan: string;
  setFilterDegreePlan: (val: string) => void;
  filterSemester: string;
  setFilterSemester: (val: string) => void;
}

/**
 * FilterBar
 * Componente que renderiza el buscador de texto libre y las cuadrículas de selectores
 * para filtrar preguntas por tipo, categoría, plan de estudios y semestre.
 */
export function FilterBar({
  searchText,
  setSearchText,
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  filterDegreePlan,
  setFilterDegreePlan,
  filterSemester,
  setFilterSemester,
}: FilterBarProps) {
  return (
    <section className={styles.filterContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Buscar por código (#JAG-XXXX), palabra clave o materia..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className={styles.filterGrid}>
        {/* Filtro por Tipo de Duda */}
        <select className={styles.filterSelect} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Todos los Tipos</option>
          <option value="general">Generales</option>
          <option value="carrera">De Carrera</option>
        </select>

        {/* Filtro por Categoría Específica */}
        <select className={styles.filterSelect} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">Todas las Categorías</option>
          <option value="campus">Campus</option>
          <option value="tramites">Trámites</option>
          <option value="materias">Materias</option>
          <option value="maestros">Maestros</option>
        </select>

        {/* Filtro por Licenciatura y Plan */}
        <select className={styles.filterSelect} value={filterDegreePlan} onChange={(e) => setFilterDegreePlan(e.target.value)}>
          <option value="all">Todas las Carreras</option>
          {DEGREE_PLANS.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.label}</option>
          ))}
        </select>

        {/* Filtro por Semestre (1° a 9°) */}
        <select className={styles.filterSelect} value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
          <option value="all">Todos los Semestres</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
            <option key={sem} value={String(sem)}>{sem}° Semestre</option>
          ))}
        </select>
      </div>
    </section>
  );
}