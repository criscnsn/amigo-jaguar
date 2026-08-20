"use client";

import { Search } from "lucide-react";
import styles from "../page.module.css";
import { DEGREE_PLANS } from "@/lib/constants/planes_materias";

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTab: "todas" | "general" | "carrera";
  setSelectedTab: (tab: "todas" | "general" | "carrera") => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  filterDegreePlan: string;
  setFilterDegreePlan: (val: string) => void;
  filterSemester: string;
  setFilterSemester: (val: string) => void;
  resetSubFilters: () => void;
}

/**
 * SearchAndFilter
 * Renderiza el buscador principal y selectores adaptados para móviles.
 * Reinicia el estado de sub-filtros al cambiar entre pestañas.
 */
export function SearchAndFilter({
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
}: SearchAndFilterProps) {
  const handleTabChange = (tab: "todas" | "general" | "carrera") => {
    setSelectedTab(tab);
    resetSubFilters();
  };

  return (
    <section className={styles.controlsSection}>
      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por palabra clave, materia o código (ej. JAG-XXXX)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${selectedTab === "todas" ? styles.tabActive : ""}`}
          onClick={() => handleTabChange("todas")}
        >
          Todas
        </button>
        <button
          className={`${styles.tab} ${selectedTab === "general" ? styles.tabActive : ""}`}
          onClick={() => handleTabChange("general")}
        >
          Generales
        </button>
        <button
          className={`${styles.tab} ${selectedTab === "carrera" ? styles.tabActive : ""}`}
          onClick={() => handleTabChange("carrera")}
        >
          De Carrera
        </button>
      </div>

      {/* Sub-filtros dinámicos con clases adaptables a móviles */}
      {(selectedTab === "general" || selectedTab === "carrera") && (
        <div className={styles.filterGrid}>
          {selectedTab === "general" && (
            <select className={styles.filterSelect} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">Todas las Categorías Generales</option>
              <option value="campus">Campus / Instalaciones</option>
              <option value="tramites">Trámites Administrativos</option>
            </select>
          )}

          {selectedTab === "carrera" && (
            <>
              <select className={styles.filterSelect} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">Todas las Categorías de Carrera</option>
                <option value="materias">Materias</option>
                <option value="maestros">Maestros / Docentes</option>
              </select>

              <select className={styles.filterSelect} value={filterDegreePlan} onChange={(e) => setFilterDegreePlan(e.target.value)}>
                <option value="all">Todas las Carreras</option>
                {DEGREE_PLANS.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.label}</option>
                ))}
              </select>

              <select className={styles.filterSelect} value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
                <option value="all">Todos los Semestres</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
                  <option key={sem} value={String(sem)}>{sem}° Semestre</option>
                ))}
              </select>
            </>
          )}
        </div>
      )}
    </section>
  );
}