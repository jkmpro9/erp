"use client";

import React from "react";
import styles from "./Clients.module.css";

const ClientsPage = () => {
  return (
    <div className={styles.container}>
      <h1>Liste des clients</h1>
      <div className={styles.clientList}>{/* Liste des clients ici */}</div>
    </div>
  );
};

export default ClientsPage;
