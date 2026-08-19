"use client";

import styles from "./page.module.css";
import { useAdminDashboard } from "./_hooks/useAdminDashboard";
import { ToastNotification } from "./_components/ToastNotification";
import { FilterBar } from "./_components/FilterBar";
import { QuestionCard } from "./_components/QuestionCard";
import { DeleteModal } from "./_components/DeleteModal";
import { GroupingModal } from "./_components/GroupingModal";
import { AdminSkeletons } from "./_components/AdminSkeletons";

export default function AdminDashboardPage() {
  const dash = useAdminDashboard();

  return (
    <div className={styles.container}>
      <ToastNotification toast={dash.toastNotification} />

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Ayudadores FMAT</h1>
          <p style={{ fontSize: "0.8125rem", color: "#64748b", margin: 0 }}>
            Ayudador activo: {dash.activeUser?.email || "Cargando..."}
          </p>
        </div>
        <button onClick={dash.handleLogout} className={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </header>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${dash.activeTab === "pending" ? styles.tabButtonActive : ""}`}
          onClick={() => dash.setActiveTab("pending")}
        >
          Dudas Pendientes ({dash.pendingQuestionsCount})
        </button>
        <button
          className={`${styles.tabButton} ${dash.activeTab === "answered" ? styles.tabButtonActive : ""}`}
          onClick={() => dash.setActiveTab("answered")}
        >
          Dudas Resueltas / Editar ({dash.answeredQuestionsCount})
        </button>
      </div>

      <FilterBar
        searchText={dash.filterSearchText}
        setSearchText={dash.setFilterSearchText}
        filterType={dash.filterType}
        setFilterType={dash.setFilterType}
        filterCategory={dash.filterCategory}
        setFilterCategory={dash.setFilterCategory}
        filterDegreePlan={dash.filterDegreePlan}
        setFilterDegreePlan={dash.setFilterDegreePlan}
        filterSemester={dash.filterSemester}
        setFilterSemester={dash.setFilterSemester}
      />

      {dash.loading ? (
        <AdminSkeletons />
      ) : dash.filteredQuestions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "0.875rem", border: "1px solid #e2e8f0" }}>
          <p style={{ fontWeight: 700, color: "#166534" }}>No hay preguntas en esta sección que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className={styles.questionList}>
          {dash.filteredQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              activeTab={dash.activeTab}
              answerText={dash.answerTexts[question.id] || ""}
              setAnswerText={(text) => dash.setAnswerText(question.id, text)}
              submittingId={dash.submittingId}
              onSaveAnswer={dash.handleSaveAnswer}
              onOpenGroupModal={(qId) => dash.setGroupModalForId(qId)}
              onOpenDeleteModal={(q) => dash.setDeleteModalQuestion(q)}
            />
          ))}
        </div>
      )}

      <DeleteModal
        question={dash.deleteModalQuestion}
        submittingId={dash.submittingId}
        onClose={() => dash.setDeleteModalQuestion(null)}
        onConfirmDelete={dash.handleDeleteQuestion}
      />

      <GroupingModal
        groupModalForId={dash.groupModalForId}
        answeredQuestions={dash.answeredQuestions}
        modalSearchText={dash.modalSearchText}
        setModalSearchText={dash.setModalSearchText}
        selectedParentQuestion={dash.selectedParentQuestion}
        setSelectedParentQuestion={dash.setSelectedParentQuestion}
        unifiedParentTitle={dash.unifiedParentTitle}
        setUnifiedParentTitle={dash.setUnifiedParentTitle}
        expandedPreviewCardId={dash.expandedPreviewCardId}
        setExpandedPreviewCardId={dash.setExpandedPreviewCardId}
        submittingId={dash.submittingId}
        onClose={dash.closeGroupModal}
        onConfirmGroup={dash.handleGroupSubmit}
      />
    </div>
  );
}