"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: string;
  clientName: string;
  date: string;
  amount: number;
  frais: number;
  usd: number;
  rmb: number;
  paymentMethod: string;
  status: string;
  reason: string;
  createdBy: string;
}

interface Client {
  id: string;
  name: string;
}

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TR001', clientName: 'RUTH BOTALI', date: '2024-06-06', amount: 268, frais: 13.41, usd: 254.59, rmb: 1782.11, paymentMethod: 'Banque', status: 'Servis', reason: 'Transfert', createdBy: 'Francy Mungedi' },
    { id: 'TR002', clientName: 'MOCA', date: '2024-06-07', amount: 11900, frais: 1190, usd: 10710, rmb: 74970, paymentMethod: 'Cash', status: 'Servis', reason: 'Commande', createdBy: 'Mungedi Jeancy' },
    { id: 'TR003', clientName: 'HELIA', date: '2024-06-07', amount: 2000, frais: 200, usd: 1800, rmb: 12600, paymentMethod: 'Cash', status: 'Servis', reason: 'Commande', createdBy: 'Mungedi Jeancy' },
  ]);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    clientName: '',
    date: '',
    amount: 0,
    frais: 0,
    usd: 0,
    rmb: 0,
    paymentMethod: '',
    status: '',
    reason: '',
    createdBy: '',
  });
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    setClients([
      { id: 'CL001', name: 'RUTH BOTALI' },
      { id: 'CL002', name: 'MOCA' },
      { id: 'CL003', name: 'HELIA' },
      // ... add more clients as needed
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = () => {
    const newId = `TR${(transactions.length + 1).toString().padStart(3, '0')}`;
    setTransactions(prev => [...prev, { id: newId, ...newTransaction }]);
    setNewTransaction({
      clientName: '',
      date: '',
      amount: 0,
      frais: 0,
      usd: 0,
      rmb: 0,
      paymentMethod: '',
      status: '',
      reason: '',
      createdBy: '',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Management</h1>
      
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
                  Transaction List
                </Button>
                <Button
                  variant={activeTab === 'create' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('create')}
                >
                  Create Transaction
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
                <CardTitle>Transaction List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paiements</TableHead>
                      <TableHead>Nom du Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Frais</TableHead>
                      <TableHead>USD</TableHead>
                      <TableHead>RMB</TableHead>
                      <TableHead>Méthode de paiement</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Créer Par</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>{transaction.clientName}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>${transaction.frais.toFixed(2)}</TableCell>
                        <TableCell>${transaction.usd.toFixed(2)}</TableCell>
                        <TableCell>¥{transaction.rmb.toFixed(2)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell>{transaction.reason}</TableCell>
                        <TableCell>{transaction.createdBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle>Create Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nom du Client</Label>
                    <Select name="clientName" onValueChange={(value) => handleSelectChange('clientName', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.name}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={newTransaction.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Montant</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="frais">Frais</Label>
                    <Input
                      id="frais"
                      name="frais"
                      type="number"
                      value={newTransaction.frais}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="usd">USD</Label>
                    <Input
                      id="usd"
                      name="usd"
                      type="number"
                      value={newTransaction.usd}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rmb">RMB</Label>
                    <Input
                      id="rmb"
                      name="rmb"
                      type="number"
                      value={newTransaction.rmb}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                    <Select name="paymentMethod" onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Banque">Banque</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Airtel Money 1">Airtel Money 1</SelectItem>
                        <SelectItem value="Airtel Money 2">Airtel Money 2</SelectItem>
                        <SelectItem value="Mpesa">Mpesa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select name="status" onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Servis">Servis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reason">Motif</Label>
                    <Select name="reason" onValueChange={(value) => handleSelectChange('reason', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transfert">Transfert</SelectItem>
                        <SelectItem value="Commande">Commande</SelectItem>
                        <SelectItem value="Paiement C...">Paiement C...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="createdBy">Créer Par</Label>
                    <Input
                      id="createdBy"
                      name="createdBy"
                      value={newTransaction.createdBy}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button onClick={handleAddTransaction} className="mt-4">Add Transaction</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
