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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

export default function ClientsPage() {
  const { toast } = useToast()
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
    toast({
      title: "Client ajouté",
      description: `${clientToAdd.name} a été ajouté avec succès.`,
    });
    setActiveTab('list');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Clients</h1>
      
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-64 pr-4">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'list' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('list')}
                >
                  Liste des Clients
                </Button>
                <Button
                  variant={activeTab === 'add' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('add')}
                >
                  Ajouter un Client
                </Button>
                <Button
                  variant={activeTab === 'stats' ? 'default' : 'ghost'}
                  className="w-full justify-start"
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
            <Card>
              <CardHeader>
                <CardTitle>Liste des Clients</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Rechercher un client..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
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
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.id}</TableCell>
                        <TableCell>
                          <Link href={`/dashboard/clients/${client.id}`} className="text-blue-600 hover:underline">
                            {client.name}
                          </Link>
                        </TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.address}</TableCell>
                        <TableCell>{client.city}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)}>
                            <Trash className="h-4 w-4" />
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
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un Nouveau Client</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddClient} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newClient.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newClient.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={newClient.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      value={newClient.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit">Ajouter le Client</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'stats' && (
            <Card>
              <CardHeader>
                <CardTitle>Statistiques des Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Les statistiques des clients seront affichées ici.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
