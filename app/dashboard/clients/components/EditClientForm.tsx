"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Client } from "../types";

interface EditClientFormProps {
  client: Client;
  onUpdateClient: (client: Client) => Promise<void>;
  onCancel: () => void;
}

export function EditClientForm({
  client,
  onUpdateClient,
  onCancel,
}: EditClientFormProps) {
  const [editingClient, setEditingClient] = useState<Client>(client);

  useEffect(() => {
    setEditingClient(client);
  }, [client]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateClient(editingClient);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Modifier un Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Nom
            </Label>
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
            <Label htmlFor="phone" className="text-base">
              Numéro de téléphone
            </Label>
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
            <Label htmlFor="city" className="text-base">
              Ville
            </Label>
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
            <Label htmlFor="address" className="text-base">
              Adresse
            </Label>
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
            <Button type="submit" className="text-base">
              Mettre à jour le Client
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-base"
              onClick={onCancel}
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
