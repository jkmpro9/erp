import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Package, CreditCard, AlertTriangle } from 'lucide-react';

const notifications = [
  { id: 1, type: 'info', message: 'Nouvelle commande reçue', icon: Package },
  { id: 2, type: 'success', message: 'Paiement confirmé', icon: CreditCard },
  { id: 3, type: 'warning', message: 'Stock faible pour le produit X', icon: AlertTriangle },
];

export function NotificationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications Récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-center space-x-4 p-2 bg-gray-100 rounded">
              <notification.icon className={`h-6 w-6 ${notification.type === 'info' ? 'text-blue-500' : notification.type === 'success' ? 'text-green-500' : 'text-yellow-500'}`} />
              <span>{notification.message}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}