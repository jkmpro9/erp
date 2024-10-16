"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Package {
  id: string;
  trackingNumber: string;
  clientName: string;
  weight: number;
  status: string;
  estimatedDelivery: string;
}

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState<'air' | 'sea'>('air');

  // Dummy data for packages
  const airPackages: Package[] = [
    { id: 'AP001', trackingNumber: 'AIR123456', clientName: 'John Doe', weight: 5.2, status: 'In Transit', estimatedDelivery: '2023-06-15' },
    { id: 'AP002', trackingNumber: 'AIR789012', clientName: 'Jane Smith', weight: 3.7, status: 'Delivered', estimatedDelivery: '2023-06-10' },
  ];

  const seaPackages: Package[] = [
    { id: 'SP001', trackingNumber: 'SEA123456', clientName: 'Alice Johnson', weight: 150, status: 'In Transit', estimatedDelivery: '2023-07-20' },
    { id: 'SP002', trackingNumber: 'SEA789012', clientName: 'Bob Williams', weight: 200, status: 'At Port', estimatedDelivery: '2023-07-25' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Package Management</h1>
      
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-64 pr-4">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'air' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('air')}
                >
                  Air Parcel
                </Button>
                <Button
                  variant={activeTab === 'sea' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('sea')}
                >
                  Sea Parcel
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === 'air' ? 'Air Parcels' : 'Sea Parcels'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Estimated Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(activeTab === 'air' ? airPackages : seaPackages).map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>{pkg.trackingNumber}</TableCell>
                      <TableCell>{pkg.clientName}</TableCell>
                      <TableCell>{pkg.weight}</TableCell>
                      <TableCell>{pkg.status}</TableCell>
                      <TableCell>{pkg.estimatedDelivery}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
