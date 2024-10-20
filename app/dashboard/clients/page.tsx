"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash, X } from 'lucide-react';
import localforage from '@/lib/localForage';
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Inter } from 'next/font/google'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const inter = Inter({ subsets: ['latin'] })

interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface Invoice {
  id: string;
  clientId: string;
  date: string;
  amount: number;
  status: 'paid' | 'unpaid';
}

interface Payment {
  id: string;
  clientId: string;
  date: string;
  amount: number;
  method: string;
}

interface Transaction {
  id: string;
  clientId: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    phone: '+243',
    address: '',
    city: '',
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([]);
  const [clientPayments, setClientPayments] = useState<Payment[]>([]);
  const [clientTransactions, setClientTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast()

  useEffect(() => {
    const loadClients = async () => {
      const storedClients = await localforage.getItem<Client[]>('clients');
      if (storedClients) {
        setClients(storedClients);
      } else {
        const initialClients = [
          { id: 'CL001', name: 'Acme Corp', phone: '+243123456789', address: '123 Main St', city: 'Kinshasa' },
          { id: 'CL002', name: 'GlobalTech', phone: '+243987654321', address: '456 Oak Ave', city: 'Lubumbashi' },
          { id: 'CL003', name: 'InnovateNow', phone: '+243555123456', address: '789 Pine Rd', city: 'Goma' },
        ];
        await localforage.setItem('clients', initialClients);
        setClients(initialClients);
      }
    };

    loadClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.phone.includes(searchTerm) ||
                          client.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCity === 'all' || client.city === filterCity;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteClient = async (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    await localforage.setItem('clients', updatedClients);
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CL${(clients.length + 1).toString().padStart(3, '0')}`;
    const clientToAdd = { ...newClient, id: newId };
    const updatedClients = [...clients, clientToAdd];
    setClients(updatedClients);
    await localforage.setItem('clients', updatedClients);
    setNewClient({ name: '', phone: '+243', address: '', city: '' });
    toast({ message: `Client ajouté: ${clientToAdd.name} a été ajouté avec succès.`, type: 'foreground' });
    setActiveTab('list');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingClient) {
      setEditingClient(prev => {
        if (prev === null) return null;
        return { ...prev, [name]: value } as Client;
      });
    } else {
      setNewClient(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setActiveTab('edit');
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const updatedClients = clients.map(client => 
      client.id === editingClient.id ? editingClient : client
    );
    setClients(updatedClients);
    await localforage.setItem('clients', updatedClients);
    toast(`Client mis à jour: ${editingClient.name} a été mis à jour avec succès.`);
    setEditingClient(null);
    setActiveTab('list');
  };

  const cancelEdit = () => {
    setEditingClient(null);
    setActiveTab('list');
  };

  const calculateStatistics = () => {
    const totalClients = clients.length;
    const clientsByCity = clients.reduce((acc, client) => {
      acc[client.city] = (acc[client.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cityData = Object.entries(clientsByCity).map(([city, count]) => ({
      city,
      count,
    }));

    const phoneCodeData = clients.reduce((acc, client) => {
      const phoneCode = client.phone.slice(0, 5); // Prend les 5 premiers chiffres comme code
      acc[phoneCode] = (acc[phoneCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const phoneCodeChartData = Object.entries(phoneCodeData)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Prend les 5 codes les plus fréquents

    return { totalClients, cityData, phoneCodeChartData };
  };

  const statistics = calculateStatistics();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleViewClientDetails = async (client: Client) => {
    setSelectedClient(client);
    // Charger les factures, paiements et transactions du client
    const invoices = await localforage.getItem<Invoice[]>('invoices') || [];
    const payments = await localforage.getItem<Payment[]>('payments') || [];
    const transactions = await localforage.getItem<Transaction[]>('transactions') || [];

    setClientInvoices(invoices.filter(invoice => invoice.clientId === client.id));
    setClientPayments(payments.filter(payment => payment.clientId === client.id));
    setClientTransactions(transactions.filter(transaction => transaction.clientId === client.id));
    setActiveTab('details');
  };

  return (
    <div className={`container mx-auto p-4 ${inter.className}`}>
      <h1 className="text-3xl font-bold mb-6">Gestion des Clients</h1>
      
      <div className="flex gap-6">
        {/* Left sidebar */}
        <div className="w-64">
          <Card className="shadow-md">
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'list' ? 'default' : 'ghost'}
                  className="w-full justify-start text-base"
                  onClick={() => setActiveTab('list')}
                >
                  Liste des Clients
                </Button>
                <Button
                  variant={activeTab === 'add' ? 'default' : 'ghost'}
                  className="w-full justify-start text-base"
                  onClick={() => setActiveTab('add')}
                >
                  Ajouter un Client
                </Button>
                <Button
                  variant={activeTab === 'stats' ? 'default' : 'ghost'}
                  className="w-full justify-start text-base"
                  onClick={() => setActiveTab('stats')}
                >
                  Statistiques
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {activeTab === 'list' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Liste des Clients</CardTitle>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 text-base"
                    />
                  </div>
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les villes</SelectItem>
                      <SelectItem value="Kinshasa">Kinshasa</SelectItem>
                      <SelectItem value="Lubumbashi">Lubumbashi</SelectItem>
                      <SelectItem value="Goma">Goma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">ID</TableHead>
                      <TableHead className="text-base">Nom</TableHead>
                      <TableHead className="text-base">Téléphone</TableHead>
                      <TableHead className="text-base">Adresse</TableHead>
                      <TableHead className="text-base">Ville</TableHead>
                      <TableHead className="text-base">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="text-base">{client.id}</TableCell>
                        <TableCell className="text-base">
                          <Link href={`/dashboard/clients/${client.id}`} className="text-blue-600 hover:underline">
                            {client.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-base">{client.phone}</TableCell>
                        <TableCell className="text-base">{client.address}</TableCell>
                        <TableCell className="text-base">{client.city}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)}>
                            <Pencil className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)}>
                            <Trash className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === 'add' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Ajouter un Nouveau Client</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddClient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newClient.name}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newClient.phone}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-base">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={newClient.city}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      value={newClient.address}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <Button type="submit" className="text-base">Ajouter le Client</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'edit' && editingClient && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Modifier un Client</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateClient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      value={editingClient.name}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={editingClient.phone}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-base">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={editingClient.city}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      value={editingClient.address}
                      onChange={handleInputChange}
                      required
                      className="text-base"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="text-base">Mettre à jour le Client</Button>
                    <Button type="button" variant="outline" className="text-base" onClick={cancelEdit}>
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'stats' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Statistiques des Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nombre total de clients : {statistics.totalClients}</h3>
                    <h3 className="text-lg font-semibold mb-2">Répartition par ville</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statistics.cityData}>
                        <XAxis dataKey="city" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Top 5 des codes téléphoniques</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statistics.phoneCodeChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statistics.phoneCodeChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'details' && selectedClient && (
            <Card>
              <CardHeader>
                <CardTitle>Détails du Client: {selectedClient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info">
                  <TabsList>
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="invoices">Factures</TabsTrigger>
                    <TabsTrigger value="payments">Paiements</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info">
                    <div className="space-y-2">
                      <p><strong>Téléphone:</strong> {selectedClient.phone}</p>
                      <p><strong>Adresse:</strong> {selectedClient.address}</p>
                      <p><strong>Ville:</strong> {selectedClient.city}</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="invoices">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Facture</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientInvoices.map(invoice => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="payments">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Paiement</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Méthode</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientPayments.map(payment => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.id}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="transactions">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Transaction</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientTransactions.map(transaction => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.id}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
