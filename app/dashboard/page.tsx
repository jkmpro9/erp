"use client"

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Bell, User, DollarSign, FileText } from 'lucide-react';

const DashboardPage = () => {
  // Données factices pour les graphiques et tableaux
  const salesData = [
    { name: 'Jan', ventes: 4000, depenses: 2400 },
    { name: 'Fév', ventes: 3000, depenses: 1398 },
    { name: 'Mar', ventes: 2000, depenses: 9800 },
    { name: 'Avr', ventes: 2780, depenses: 3908 },
    { name: 'Mai', ventes: 1890, depenses: 4800 },
    { name: 'Juin', ventes: 2390, depenses: 3800 },
  ];

  const clientData = [
    { name: 'Jan', clients: 100 },
    { name: 'Fév', clients: 120 },
    { name: 'Mar', clients: 150 },
    { name: 'Avr', clients: 180 },
    { name: 'Mai', clients: 200 },
    { name: 'Juin', clients: 220 },
  ];

  const recentReports = [
    { id: 1, name: 'Rapport de Ventes Mensuel', date: '2023-06-01', type: 'Excel' },
    { id: 2, name: 'Analyse des Clients', date: '2023-06-15', type: 'PDF' },
    { id: 3, name: 'Inventaire des Produits', date: '2023-06-30', type: 'CSV' },
  ];

  const recentNotifications = [
    { id: 1, message: 'Nouvelle commande reçue', time: '2 minutes ago' },
    { id: 2, message: 'Paiement confirmé pour la facture #1234', time: '1 heure ago' },
    { id: 3, message: 'Stock faible pour le produit XYZ', time: '3 heures ago' },
  ];

  const newClients = [
    { id: 1, name: 'Alice Johnson', date: '2023-06-01', location: 'Kinshasa' },
    { id: 2, name: 'Bob Smith', date: '2023-06-02', location: 'Lubumbashi' },
    { id: 3, name: 'Charlie Brown', date: '2023-06-03', location: 'Goma' },
  ];

  const recentTransactions = [
    { id: 1, client: 'Alice Johnson', amount: 500, date: '2023-06-01', status: 'Complété' },
    { id: 2, client: 'Bob Smith', amount: 750, date: '2023-06-02', status: 'En attente' },
    { id: 3, client: 'Charlie Brown', amount: 1000, date: '2023-06-03', status: 'Complété' },
  ];

  const recentInvoices = [
    { id: 'INV001', client: 'Alice Johnson', amount: 500, date: '2023-06-01', status: 'Payée' },
    { id: 'INV002', client: 'Bob Smith', amount: 750, date: '2023-06-02', status: 'En attente' },
    { id: 'INV003', client: 'Charlie Brown', amount: 1000, date: '2023-06-03', status: 'Payée' },
  ];

  const [invoiceNumber, setInvoiceNumber] = useState('');

  useEffect(() => {
    // Générer le numéro de facture au chargement de la page
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInvoiceNumber(`COCCI-${month}-${randomNum}`);
  }, []);

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger 
          value="overview" 
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Vue d'ensemble
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
        >
          Analytiques
        </TabsTrigger>
        <TabsTrigger 
          value="reports" 
          className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
        >
          Rapports
        </TabsTrigger>
        <TabsTrigger 
          value="notifications" 
          className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
        >
          Notifications
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes Totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">$24,000</p>
                  <p className="text-sm text-gray-500">+15% par rapport au mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Nouveaux Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">120</p>
                  <p className="text-sm text-gray-500">+5% par rapport au mois dernier</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Nouveaux Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Localisation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.date}</TableCell>
                          <TableCell>{client.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transactions Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.client}</TableCell>
                          <TableCell>${transaction.amount}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Factures Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Facture</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>${invoice.amount}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Numéro de Facture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{invoiceNumber}</p>
                <p className="text-sm text-gray-500">Généré automatiquement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Date de Création</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Date actuelle</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ventes" fill="#8884d8" />
                  <Bar dataKey="depenses" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[400px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clientData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clients" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="reports">
        <Card>
          <CardHeader>
            <CardTitle>Rapports Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du Rapport</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentNotifications.map((notification) => (
                <li key={notification.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="font-semibold text-white">{notification.message}</p>
                    <p className="text-sm text-gray-400">{notification.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardPage;
