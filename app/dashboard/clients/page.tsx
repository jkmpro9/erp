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

  useEffect(() => {
    const loadClients = async () => {
      const storedClients = await localforage.getItem<Client[]>('clients');
      if (storedClients) {
        setClients(storedClients);
      } else {
        // Initial data if no clients are stored
        const initialClients = [
          { id: 'CL001', name: 'Acme Corp', phone: '123-456-7890', address: '123 Main St', city: 'New York' },
          { id: 'CL002', name: 'GlobalTech', phone: '098-765-4321', address: '456 Oak Ave', city: 'San Francisco' },
          { id: 'CL003', name: 'InnovateNow', phone: '555-123-4567', address: '789 Pine Rd', city: 'Chicago' },
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="mb-4">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-rows-3">
              <TabsTrigger value="list">Client List</TabsTrigger>
              <TabsTrigger value="add">Add New Client</TabsTrigger>
              <TabsTrigger value="stats">Client Statistics</TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetContent>
      </Sheet>

      <TabsContent value="list" className="mt-0">
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
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="Chicago">Chicago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
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
      </TabsContent>

      <TabsContent value="add">
        <Card>
          <CardHeader>
            <CardTitle>Add New Client</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add form for new client here */}
            <p>Form to add a new client will be implemented here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stats">
        <Card>
          <CardHeader>
            <CardTitle>Client Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add client statistics here */}
            <p>Client statistics will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}
