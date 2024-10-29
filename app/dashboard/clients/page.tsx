"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ClientList } from "./components/ClientList";
import { AddClientForm } from "./components/AddClientForm";
import { ClientStatistics } from "./components/ClientStatistics";
import type { Client, NewClient } from "./types";
import { supabase } from "@/utils/supabase";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { user } = useAuth();
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadClients();
  }, [user, router, currentPage]);

  const loadClients = async () => {
    try {
      const { data, error, count } = await supabase
        .from("clients")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setClients(data || []);
      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (newClient: NewClient) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .insert([newClient])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setClients([data, ...clients]);
        toast({
          title: "Success",
          description: "Client added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
    }
  };

  const handleEditClient = async (client: Client) => {
    try {
      const { error } = await supabase
        .from("clients")
        .update(client)
        .eq("id", client.id);

      if (error) throw error;

      setClients(clients.map(c => c.id === client.id ? client : c));
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Error",
        description: "Failed to update client",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setClients(clients.filter(c => c.id !== id));
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <AddClientForm onAddClient={handleAddClient} />
          <ClientStatistics clients={clients} />
        </div>
        <div>
          <ClientList
            clients={clients}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
