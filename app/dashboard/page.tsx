"use client";

import React from "react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Tableau de bord CoBill CRM</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Résumé des clients</h2>
          {/* Contenu du résumé des clients */}
        </section>
        <section className={styles.section}>
          <h2>Factures récentes</h2>
          {/* Liste des factures récentes */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
