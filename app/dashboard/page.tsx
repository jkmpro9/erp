"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { supabase } from "@/utils/supabase";
import { Users, Package, FileText, DollarSign } from "lucide-react";

interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  totalParcels: number;
  totalRevenue: number;
  recentActivity: Array<{
    name: string;
    value: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalInvoices: 0,
    totalParcels: 0,
    totalRevenue: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    async function fetchDashboardData() {
      try {
        // Fetch total clients
        const { count: clientCount } = await supabase
          .from("clients")
          .select("*", { count: "exact" });

        // Fetch total invoices
        const { count: invoiceCount } = await supabase
          .from("invoices")
          .select("*", { count: "exact" });

        // Fetch total parcels
        const { count: parcelCount } = await supabase
          .from("packages")
          .select("*", { count: "exact" });

        // Fetch total revenue
        const { data: invoices } = await supabase
          .from("invoices")
          .select("total_amount");

        const totalRevenue = invoices?.reduce(
          (sum, invoice) => sum + (invoice.total_amount || 0),
          0
        ) || 0;

        // Fetch recent activity (last 7 days of invoices)
        const { data: recentInvoices } = await supabase
          .from("invoices")
          .select("created_at, total_amount")
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order("created_at", { ascending: true });

        const recentActivity = recentInvoices?.map(invoice => ({
          name: new Date(invoice.created_at).toLocaleDateString(),
          value: invoice.total_amount || 0,
        })) || [];

        setStats({
          totalClients: clientCount || 0,
          totalInvoices: invoiceCount || 0,
          totalParcels: parcelCount || 0,
          totalRevenue,
          recentActivity,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardCard
          title="Total Clients"
          value={stats.totalClients}
          icon={<Users className="h-8 w-8" />}
        />
        <DashboardCard
          title="Total Factures"
          value={stats.totalInvoices}
          icon={<FileText className="h-8 w-8" />}
        />
        <DashboardCard
          title="Total Colis"
          value={stats.totalParcels}
          icon={<Package className="h-8 w-8" />}
        />
        <DashboardCard
          title="Revenu Total"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <DashboardChart
          title="Activité des 7 derniers jours"
          data={stats.recentActivity}
        />
      </div>
    </div>
  );
}
