"use client";

import styles from "../page.module.css";

/**
 * AdminSkeletons
 * Muestra tarjetas con animación de pulso mientras se realiza el fetch de preguntas a Supabase.
 */
export function AdminSkeletons() {
  return (
    <div className={styles.skeletonSection}>
      {[1, 2, 3].map((index) => (
        <div key={index} className={styles.skeletonCard}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div className={styles.skeletonLine} style={{ width: "80px" }}></div>
            <div className={styles.skeletonLine} style={{ width: "100px" }}></div>
            <div className={styles.skeletonLine} style={{ width: "120px" }}></div>
          </div>
          <div className={styles.skeletonLine} style={{ width: "65%", height: "1.25rem" }}></div>
          <div className={styles.skeletonLine} style={{ width: "100%", height: "4.5rem" }}></div>
        </div>
      ))}
    </div>
  );
}