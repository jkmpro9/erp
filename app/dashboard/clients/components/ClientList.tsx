"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash } from 'lucide-react';

interface Client {
  id: string;
  custom_id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface ClientListProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export const ClientList = ({ clients, onEditClient, onDeleteClient }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.phone.includes(searchTerm) ||
                          client.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCity === 'all' || client.city === filterCity;
    return matchesSearch && matchesFilter;
  });

  return (
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
                <TableCell className="text-base">{client.custom_id}</TableCell>
                <TableCell className="text-base">
                  <Link href={`/dashboard/clients/${client.id}`} className="text-blue-600 hover:underline">
                    {client.name}
                  </Link>
                </TableCell>
                <TableCell className="text-base">{client.phone}</TableCell>
                <TableCell className="text-base">{client.address}</TableCell>
                <TableCell className="text-base">{client.city}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onEditClient(client)}>
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteClient(client.id)}>
                    <Trash className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
