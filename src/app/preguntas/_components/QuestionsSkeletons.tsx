"use client";

import styles from "../page.module.css";

/**
 * QuestionsSkeletons
 * Renderiza tarjetas animadas mientras se consulta Supabase en el feed público.
 */
export function QuestionsSkeletons() {
  return (
    <div className={styles.skeletonFeed}>
      {[1, 2, 3].map((index) => (
        <div key={index} className={styles.skeletonCard}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div className={styles.skeletonLine} style={{ width: "90px" }}></div>
            <div className={styles.skeletonLine} style={{ width: "80px" }}></div>
            <div className={styles.skeletonLine} style={{ width: "110px" }}></div>
          </div>
          <div className={styles.skeletonLine} style={{ width: "70%", height: "1.5rem" }}></div>
          <div className={styles.skeletonLine} style={{ width: "100%", height: "4rem" }}></div>
        </div>
      ))}
    </div>
  );
}