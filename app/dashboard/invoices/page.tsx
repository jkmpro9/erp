"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Link, Pencil, Trash } from 'lucide-react';

interface Article {
  imageUrl: string;
  description: string;
  quantity: number;
  unitPrice: number;
  weightCbm: number;
  itemLink: string;
}

interface Invoice {
  id: string;
  clientName: string;
  creationDate: string;
  amount: number;
  createdBy: string;
  clientPhone: string;
  clientAddress: string;
  deliveryLocation: string;
  deliveryMethod: string;
  items: Article[];
}

interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

const clientList: Client[] = [
  { id: 'CL001', name: 'Acme Corp', phone: '123-456-7890', address: '123 Main St', city: 'New York' },
  { id: 'CL002', name: 'GlobalTech', phone: '098-765-4321', address: '456 Oak Ave', city: 'San Francisco' },
  { id: 'CL003', name: 'InnovateNow', phone: '555-123-4567', address: '789 Pine Rd', city: 'Chicago' },
];

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'FAC001', clientName: 'Acme Corp', creationDate: '2023-06-01', amount: 5000, createdBy: 'John Doe', clientPhone: '123-456-7890', clientAddress: '123 Main St', deliveryLocation: 'New York', deliveryMethod: 'Air', items: [] },
    { id: 'FAC002', clientName: 'GlobalTech', creationDate: '2023-06-05', amount: 7500, createdBy: 'Jane Smith', clientPhone: '098-765-4321', clientAddress: '456 Oak Ave', deliveryLocation: 'San Francisco', deliveryMethod: 'Sea', items: [] },
  ]);
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id' | 'creationDate' | 'amount' | 'createdBy'>>({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    deliveryLocation: '',
    deliveryMethod: '',
    items: []
  });
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  const [newArticle, setNewArticle] = useState<Article>({
    imageUrl: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    weightCbm: 0,
    itemLink: '',
  });

  const handleRemoveAllItems = () => {
    setNewInvoice({ ...newInvoice, items: [] });
  };

  const handleAddArticle = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, newArticle],
    });
    setNewArticle({
      imageUrl: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      weightCbm: 0,
      itemLink: '',
    });
    setIsAddArticleOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleClientSelect = (clientName: string) => {
    const selectedClient = clientList.find(client => client.name === clientName);
    if (selectedClient) {
      setNewInvoice({
        ...newInvoice,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address,
      });
    }
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const handleCreateInvoice = () => {
    const newId = `FAC${(invoices.length + 1).toString().padStart(3, '0')}`;
    const amount = newInvoice.items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
    const newInvoiceWithId: Invoice = {
      ...newInvoice,
      id: newId,
      creationDate: new Date().toISOString().split('T')[0],
      amount,
      createdBy: 'Current User', // Replace with actual logged-in user
    };
    setInvoices([...invoices, newInvoiceWithId]);
    setNewInvoice({
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      deliveryLocation: '',
      deliveryMethod: '',
      items: []
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Factures</h1>
      
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
                  Liste des Factures
                </Button>
                <Button
                  variant={activeTab === 'create' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('create')}
                >
                  Créer une Facture
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
                <CardTitle>Liste des Factures</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Facture</TableHead>
                      <TableHead>Nom du Client</TableHead>
                      <TableHead>Date de Création</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Créé Par</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>{invoice.creationDate}</TableCell>
                        <TableCell>{invoice.amount.toFixed(2)} €</TableCell>
                        <TableCell>{invoice.createdBy}</TableCell>
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
                <CardTitle>Créer une Nouvelle Facture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Client Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Informations du Client</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName">Nom du Client</Label>
                        <Select onValueChange={handleClientSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientList.map((client) => (
                              <SelectItem key={client.id} value={client.name}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Téléphone du Client</Label>
                        <Input
                          id="clientPhone"
                          value={newInvoice.clientPhone}
                          onChange={(e) => setNewInvoice({ ...newInvoice, clientPhone: e.target.value })}
                          placeholder="Téléphone du client"
                          readOnly
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientAddress">Adresse du Client</Label>
                        <Input
                          id="clientAddress"
                          value={newInvoice.clientAddress}
                          onChange={(e) => setNewInvoice({ ...newInvoice, clientAddress: e.target.value })}
                          placeholder="Adresse du client"
                          readOnly
                        />
                      </div>
                      <div>
                        <Label htmlFor="deliveryLocation">Lieu de Livraison</Label>
                        <Select name="deliveryLocation" onValueChange={(value) => handleClientInfoChange({ target: { name: 'deliveryLocation', value } } as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le lieu de livraison" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lubumbashi">Lubumbashi</SelectItem>
                            <SelectItem value="kinshasa">Kinshasa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="deliveryMethod">Méthode de Livraison</Label>
                        <Select name="deliveryMethod" onValueChange={(value) => handleClientInfoChange({ target: { name: 'deliveryMethod', value } } as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la méthode de livraison" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="air">Air</SelectItem>
                            <SelectItem value="sea">Mer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Articles */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Articles</h3>
                    <div className="flex justify-between mb-2">
                      <Button variant="destructive" onClick={handleRemoveAllItems}>Effacer tous les Articles</Button>
                      <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Ajouter un Article</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Ajouter un Nouveau Article</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="imageUrl" className="text-right">URL de l'Image</Label>
                              <Input id="imageUrl" name="imageUrl" value={newArticle.imageUrl} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="description" className="text-right">Description</Label>
                              <Input id="description" name="description" value={newArticle.description} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="quantity" className="text-right">Quantité</Label>
                              <Input id="quantity" name="quantity" type="number" value={newArticle.quantity} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="unitPrice" className="text-right">Prix Unitaire</Label>
                              <Input id="unitPrice" name="unitPrice" type="number" value={newArticle.unitPrice} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="weightCbm" className="text-right">Poids/CBM</Label>
                              <Input id="weightCbm" name="weightCbm" type="number" value={newArticle.weightCbm} onChange={handleInputChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="itemLink" className="text-right">Lien de l'Article</Label>
                              <Input id="itemLink" name="itemLink" value={newArticle.itemLink} onChange={handleInputChange} className="col-span-3" />
                            </div>
                          </div>
                          <Button onClick={handleAddArticle}>Ajouter l'Article</Button>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">NUM</TableHead>
                          <TableHead>IMAGE</TableHead>
                          <TableHead>QTY</TableHead>
                          <TableHead>DESCRIPTION</TableHead>
                          <TableHead>PRIX UNIT</TableHead>
                          <TableHead>POIDS/CBM</TableHead>
                          <TableHead>MONTANT</TableHead>
                          <TableHead>LIEN</TableHead>
                          <TableHead>ACTION</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {newInvoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <img src={item.imageUrl} alt={item.description} className="w-12 h-12 object-cover" />
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{Number(item.unitPrice).toFixed(2)} €</TableCell>
                            <TableCell>{item.weightCbm}</TableCell>
                            <TableCell>{item.quantity * item.unitPrice} €</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={item.itemLink} target="_blank" rel="noopener noreferrer">
                                  <Link className="h-4 w-4" />
                                </a>
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Calculations */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Calculs</h3>
                    {/* Ajouter la section des calculs ici */}
                  </div>

                  {/* Conditions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Conditions</h3>
                    {/* Ajouter la section des conditions ici */}
                  </div>

                  <Button onClick={handleCreateInvoice}>Créer la Facture</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
