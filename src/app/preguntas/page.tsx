"use client";

import { MessageSquare } from "lucide-react";
import styles from "./page.module.css";
import { useAnsweredQuestions } from "./_hooks/useAnsweredQuestions";
import { FaqCarousel } from "./_components/FaqCarousel";
import { SearchAndFilter } from "./_components/SearchAndFilter";
import { QuestionFeedCard } from "./_components/QuestionFeedCard";
import { QuestionsSkeletons } from "./_components/QuestionsSkeletons";

export default function PreguntasRespondidasPage() {
  const feed = useAnsweredQuestions();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Preguntas y Respuestas</h1>
        <p className={styles.subtitle}>
          Consulta las respuestas redactadas por estudiantes avanzados de la FMAT.
        </p>
      </header>

      <FaqCarousel />

      <SearchAndFilter
        searchQuery={feed.searchQuery}
        setSearchQuery={feed.setSearchQuery}
        selectedTab={feed.selectedTab}
        setSelectedTab={feed.setSelectedTab}
        filterCategory={feed.filterCategory}
        setFilterCategory={feed.setFilterCategory}
        filterDegreePlan={feed.filterDegreePlan}
        setFilterDegreePlan={feed.setFilterDegreePlan}
        filterSemester={feed.filterSemester}
        setFilterSemester={feed.setFilterSemester}
        resetSubFilters={feed.resetSubFilters}
      />

      <section className={styles.communitySection}>
        <div className={styles.communityHeader}>
          <MessageSquare size={20} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Dudas de la Comunidad</h2>
        </div>

        {feed.loading ? (
          <QuestionsSkeletons />
        ) : feed.filteredQuestions.length === 0 ? (
          <div className={styles.emptyCard}>
            <p className={styles.emptyTitle}>No se encontraron preguntas resueltas</p>
            <p className={styles.emptySub}>
              Intenta con otras palabras clave o ajusta los filtros.
            </p>
          </div>
        ) : (
          <div className={styles.feed}>
            {feed.filteredQuestions.map((q) => (
              <QuestionFeedCard
                key={q.id}
                question={q}
                isUpvoted={feed.upvotedIds.includes(q.id)}
                onUpvote={feed.handleUpvote}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}