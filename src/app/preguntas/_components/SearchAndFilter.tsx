"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
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
 * Controles de búsqueda con despliegue fijo en escritorio
 * y botón colapsable contextual para móviles.
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
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Conteo de filtros activos para la insignia numérica
  const activeFiltersCount = [
    filterCategory !== "all",
    filterDegreePlan !== "all",
    filterSemester !== "all",
  ].filter(Boolean).length;

  const handleTabChange = (tab: "todas" | "general" | "carrera") => {
    setSelectedTab(tab);
    resetSubFilters();
    setIsOpenMobile(false);
  };

  // Texto contextual para el botón móvil según la sección activa
  const getMobileButtonText = () => {
    if (isOpenMobile) return "Ocultar filtros";
    if (selectedTab === "general") return "Filtrar por campus o trámites";
    return "Filtrar por carrera, materia o maestro";
  };

  return (
    <section className={styles.controlsSection}>
      {/* Buscador libre */}
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

      {/* Pestañas primarias */}
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

      {/* Selectores adicionales (Visibles siempre en PC, colapsables en móvil) */}
      {selectedTab !== "todas" && (
        <div>
          {/* Botón visible solo en móviles por CSS */}
          <button
            type="button"
            className={styles.filterToggleBtn}
            onClick={() => setIsOpenMobile((prev) => !prev)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <SlidersHorizontal size={15} />
              {getMobileButtonText()}
              {activeFiltersCount > 0 && (
                <span className={styles.activeFilterBadge}>{activeFiltersCount}</span>
              )}
            </span>
            {isOpenMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Contenedor de filtros */}
          <div className={`${styles.collapsibleFilterPanel} ${isOpenMobile ? styles.panelOpen : ""}`}>
            {activeFiltersCount > 0 && (
              <div className={styles.filterHeaderRow}>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Filtros activos ({activeFiltersCount}):
                </span>
                <button type="button" onClick={resetSubFilters} className={styles.clearFiltersBtn}>
                  Limpiar filtros
                </button>
              </div>
            )}

            <div className={styles.filterGrid}>
              {/* Opciones de Dudas Generales */}
              {selectedTab === "general" && (
                <select
                  className={styles.filterSelect}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">Todas las Categorías Generales</option>
                  <option value="campus">Campus / Instalaciones</option>
                  <option value="tramites">Trámites Administrativos</option>
                </select>
              )}

              {/* Opciones de Dudas de Carrera */}
              {selectedTab === "carrera" && (
                <>
                  <select
                    className={styles.filterSelect}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">Todas las Categorías</option>
                    <option value="materias">Materias</option>
                    <option value="maestros">Maestros / Docentes</option>
                  </select>

                  <select
                    className={styles.filterSelect}
                    value={filterDegreePlan}
                    onChange={(e) => setFilterDegreePlan(e.target.value)}
                  >
                    <option value="all">Todas las Carreras</option>
                    {DEGREE_PLANS.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className={styles.filterSelect}
                    value={filterSemester}
                    onChange={(e) => setFilterSemester(e.target.value)}
                  >
                    <option value="all">Todos los Semestres</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sem) => (
                      <option key={sem} value={String(sem)}>
                        {sem}° Semestre
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}