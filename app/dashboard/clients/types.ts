import { ReactNode } from "react";

export interface Client {
  custom_id: string;
  city: string;
  address: string;
  phone: string;
  id: string;
  name: string;
  email: string;

  // Ajoutez ici les autres propriétés du client si nécessaire
}

export type NewClient = Omit<Client, "id" | "custom_id">;
