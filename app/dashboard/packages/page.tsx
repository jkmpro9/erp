"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import localforage from '@/lib/localForage';

interface Package {
  id: string;
  clientId: string;
  trackingNumber: string;
  status: string;
  creationDate: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [newPackage, setNewPackage] = useState<Omit<Package, 'id' | 'creationDate'>>({
    clientId: '',
    trackingNumber: '',
    status: 'En attente',
  });

  useEffect(() => {
    const loadData = async () => {
      const storedPackages = await localforage.getItem<Package[]>('packages');
      if (storedPackages) {
        setPackages(storedPackages);
      }

      const storedClients = await localforage.getItem<Client[]>('clients');
      if (storedClients) {
        setClients(storedClients);
      }
    };

    loadData();
  }, []);

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PKG${(packages.length + 1).toString().padStart(3, '0')}`;
    const packageToAdd = {
      ...newPackage,
      id: newId,
      creationDate: new Date().toISOString().split('T')[0],
    };
    const updatedPackages = [...packages, packageToAdd];
    setPackages(updatedPackages);
    await localforage.setItem('packages', updatedPackages);
    setNewPackage({ clientId: '', trackingNumber: '', status: 'En attente' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Colis</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ajouter un Nouveau Colis</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPackage} className="space-y-4">
            <div>
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={newPackage.clientId}
                onValueChange={(value) => setNewPackage({ ...newPackage, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="trackingNumber">Numéro de Suivi</Label>
              <Input
                id="trackingNumber"
                value={newPackage.trackingNumber}
                onChange={(e) => setNewPackage({ ...newPackage, trackingNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={newPackage.status}
                onValueChange={(value) => setNewPackage({ ...newPackage, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="En transit">En transit</SelectItem>
                  <SelectItem value="Livré">Livré</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Ajouter le Colis</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Colis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Numéro de Suivi</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de Création</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.id}</TableCell>
                  <TableCell>{clients.find(c => c.id === pkg.clientId)?.name || 'N/A'}</TableCell>
                  <TableCell>{pkg.trackingNumber}</TableCell>
                  <TableCell>{pkg.status}</TableCell>
                  <TableCell>{pkg.creationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
