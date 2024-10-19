"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash, Menu } from 'lucide-react';
import localforage from '@/lib/localForage';
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    phone: '+243',
    address: '',
    city: '',
  });
  const [clientToAdd, setClientToAdd] = useState<Client | null>(null);
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
    toast({ message: `Client ajouté: ${clientToAdd.name} a été ajouté avec succès.`, type: 'success' });
    setActiveTab('list');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClientForm = (client: Client) => {
    setClientToAdd(client);
    toast({ message: `Client ajouté: ${client.name} a été ajouté avec succès.`, type: 'foreground' });
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
                          <Button variant="ghost" size="sm">
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

          {activeTab === 'stats' && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Statistiques des Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">Les statistiques des clients seront affichées ici.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
