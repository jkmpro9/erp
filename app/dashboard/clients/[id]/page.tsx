"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { FileText, CreditCard, RefreshCcw, Package } from "lucide-react";

interface Customer {
  id: string;
  custom_id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: string;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

interface Package {
  id: string;
  date: string;
  status: string;
  trackingNumber: string;
}

export default function ClientDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeTab, setActiveTab] = useState("invoices");

  const fetchClientDetails = useCallback(async () => {
    try {
      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", params?.id)
        .single();

      if (customerError) throw customerError;
      setCustomer(customerData);

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("*")
        .eq("clientId", params?.id);

      if (invoicesError) throw invoicesError;
      setInvoices(invoicesData);

      // Fetch payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*")
        .eq("clientId", params?.id);

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } =
        await supabase
          .from("transactions")
          .select("*")
          .eq("clientId", params?.id);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData);

      // Fetch packages
      const { data: packagesData, error: packagesError } = await supabase
        .from("packages")
        .select("*")
        .eq("clientId", params?.id)
        .single();

      if (packagesError) throw packagesError;
      setPackages(packagesData);
    } catch (error) {
      console.error("Error fetching client details:", error);
      toast({
        title: "Erreur",
        content:
          "Impossible de charger les détails du client. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }, [params?.id, toast]);

  useEffect(() => {
    if (params?.id) fetchClientDetails();
  }, [fetchClientDetails, params?.id]);

  if (!customer) {
    return <div>Chargement...</div>;
  }

  const tabs = [
    { id: "invoices", label: "Factures", icon: FileText },
    { id: "payments", label: "Paiements", icon: CreditCard },
    { id: "transactions", label: "Transactions", icon: RefreshCcw },
    { id: "packages", label: "Colis", icon: Package },
  ];

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Détails du Client: {customer.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>ID:</strong> {customer.custom_id}
          </p>
          <p>
            <strong>Téléphone:</strong> {customer.phone}
          </p>
          <p>
            <strong>Adresse:</strong> {customer.address}
          </p>
          <p>
            <strong>Ville:</strong> {customer.city}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 mx-2 rounded-full ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {tabs.find((tab) => tab.id === activeTab)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {activeTab === "invoices" && (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                  </>
                )}
                {activeTab === "payments" && (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                  </>
                )}
                {activeTab === "transactions" && (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Montant</TableHead>
                  </>
                )}
                {activeTab === "packages" && (
                  <>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Numéro de suivi</TableHead>
                    <TableHead>Statut</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeTab === "invoices" &&
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{invoice.amount.toFixed(2)} $</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                  </TableRow>
                ))}
              {activeTab === "payments" &&
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{payment.amount.toFixed(2)} $</TableCell>
                    <TableCell>{payment.method}</TableCell>
                  </TableRow>
                ))}
              {activeTab === "transactions" &&
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.amount.toFixed(2)} $</TableCell>
                  </TableRow>
                ))}
              {activeTab === "packages" &&
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{pkg.id}</TableCell>
                    <TableCell>
                      {new Date(pkg.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{pkg.trackingNumber}</TableCell>
                    <TableCell>{pkg.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
