'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import localforage from '@/lib/localForage';

interface Customer {
  id: string;
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

export default function CustomerPage() {
  const params = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      const clients = await localforage.getItem<Customer[]>('clients');
      const customerData = clients?.find(c => c.id === params.id) || null;
      setCustomer(customerData);

      // Fetch related data (invoices, payments, transactions, packages)
      // These are mock implementations. Replace with actual data fetching logic.
      const storedInvoices = await localforage.getItem<Invoice[]>(`invoices_${params.id}`);
      setInvoices(storedInvoices || []);

      const storedPayments = await localforage.getItem<Payment[]>(`payments_${params.id}`);
      setPayments(storedPayments || []);

      const storedTransactions = await localforage.getItem<Transaction[]>(`transactions_${params.id}`);
      setTransactions(storedTransactions || []);

      const storedPackages = await localforage.getItem<Package[]>(`packages_${params.id}`);
      setPackages(storedPackages || []);
    };

    fetchCustomerData();
  }, [params.id]);

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Details: {customer.name}</h1>
      <Card className="mb-4">
        <CardContent>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>City:</strong> {customer.city}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.amount}</TableCell>
                      <TableCell>{invoice.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle>Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>{pkg.id}</TableCell>
                      <TableCell>{pkg.date}</TableCell>
                      <TableCell>{pkg.status}</TableCell>
                      <TableCell>{pkg.trackingNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
