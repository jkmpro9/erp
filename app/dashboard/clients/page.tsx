"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Updated dummy data for clients
const initialClients = [
  { id: 'CL001', name: 'Acme Corp', phone: '123-456-7890', address: '123 Main St', city: 'New York' },
  { id: 'CL002', name: 'GlobalTech', phone: '098-765-4321', address: '456 Oak Ave', city: 'San Francisco' },
  { id: 'CL003', name: 'InnovateNow', phone: '555-123-4567', address: '789 Pine Rd', city: 'Chicago' },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const [newClient, setNewClient] = useState({ name: '', phone: '', address: '', city: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleAddClient = () => {
    if (newClient.name && newClient.phone && newClient.address && newClient.city) {
      const newId = `CL${(clients.length + 1).toString().padStart(3, '0')}`;
      setClients([...clients, { id: newId, ...newClient }]);
      setNewClient({ name: '', phone: '', address: '', city: '' });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Client Management</h1>
      
      <Tabs defaultValue="add" className="space-y-4">
        <TabsList>
          <TabsTrigger value="add">Add New Client</TabsTrigger>
          <TabsTrigger value="list">Client List</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Name"
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Phone"
                  name="phone"
                  value={newClient.phone}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Address"
                  name="address"
                  value={newClient.address}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="City"
                  name="city"
                  value={newClient.city}
                  onChange={handleInputChange}
                />
              </div>
              <Button onClick={handleAddClient} className="mt-4">Add Client</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Client List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.id}</TableCell>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{client.address}</TableCell>
                      <TableCell>{client.city}</TableCell>
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