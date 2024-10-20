"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label"

interface NewClient {
  name: string;
  phone: string;
  address: string;
  city: string;
  custom_id: string;
}

interface AddClientFormProps {
  onAddClient: (client: NewClient) => Promise<void>;
}

export const AddClientForm = ({ onAddClient }: AddClientFormProps) => {
  const [newClient, setNewClient] = useState<NewClient>({
    name: '',
    phone: '+243',
    address: '',
    city: '',
    custom_id: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddClient(newClient);
    setNewClient({ name: '', phone: '+243', address: '', city: '', custom_id: '' });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Ajouter un Nouveau Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
