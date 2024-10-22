"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { Client } from "./clients/types";

interface DashboardData {
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  recentClients: Client[];
}

export default function DashboardPage() {
  const { session, loading } = useAuthContext();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    recentClients: [],
  });

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total number of clients
      const { count: clientCount, error: clientError } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

      if (clientError) throw clientError;

      // Fetch total number of invoices
      const { count: invoiceCount, error: invoiceError } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true });

      if (invoiceError) throw invoiceError;

      // Fetch total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from("invoices")
        .select("amount")
        .eq("status", "paid");

      if (revenueError) throw revenueError;

      const totalRevenue = revenueData?.reduce(
        (sum, invoice) => sum + invoice.amount,
        0
      );

      // Fetch recent clients
      const { data: clients, error: recentClientsError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentClientsError) throw recentClientsError;

      setDashboardData({
        totalClients: clientCount || 0,
        totalInvoices: invoiceCount || 0,
        totalRevenue: totalRevenue || 0,
        recentClients: clients || [],
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du tableau de bord:",
        error
      );
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return null; // Cela ne devrait pas être rendu car l'utilisateur sera redirigé
  }

  return (
    <div className="flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={fetchDashboardData}>Actualiser</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalClients}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Factures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalInvoices}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenu Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboardData.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Clients Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales clients={dashboardData.recentClients} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
