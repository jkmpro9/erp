"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  clientName: string;
  deliveryLocation: string;
  deliveryMethod: string;
  items: Article[];
}

export default function InvoicesPage() {
  const [newInvoice, setNewInvoice] = useState<Invoice>({
    clientName: '',
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

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoice Management</h1>
      
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Invoice</TabsTrigger>
          <TabsTrigger value="list">Invoice List</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        name="clientName"
                        value={newInvoice.clientName}
                        onChange={handleClientInfoChange}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryLocation">Delivery Location</Label>
                      <Select name="deliveryLocation" onValueChange={(value) => handleClientInfoChange({ target: { name: 'deliveryLocation', value } } as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lubumbashi">Lubumbashi</SelectItem>
                          <SelectItem value="kinshasa">Kinshasa</SelectItem>
                          {/* Add more locations as needed */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="deliveryMethod">Delivery Method</Label>
                      <Select name="deliveryMethod" onValueChange={(value) => handleClientInfoChange({ target: { name: 'deliveryMethod', value } } as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="air">Air</SelectItem>
                          <SelectItem value="sea">Sea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Articles */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Articles</h3>
                  <div className="flex justify-between mb-2">
                    <Button variant="destructive" onClick={handleRemoveAllItems}>EFFACER TOUS LES ARTICLES</Button>
                    <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">AJOUTER UN ARTICLE</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Article</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                            <Input id="imageUrl" name="imageUrl" value={newArticle.imageUrl} onChange={handleInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input id="description" name="description" value={newArticle.description} onChange={handleInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">Quantity</Label>
                            <Input id="quantity" name="quantity" type="number" value={newArticle.quantity} onChange={handleInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unitPrice" className="text-right">Unit Price</Label>
                            <Input id="unitPrice" name="unitPrice" type="number" value={newArticle.unitPrice} onChange={handleInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="weightCbm" className="text-right">Weight/CBM</Label>
                            <Input id="weightCbm" name="weightCbm" type="number" value={newArticle.weightCbm} onChange={handleInputChange} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemLink" className="text-right">Item Link</Label>
                            <Input id="itemLink" name="itemLink" value={newArticle.itemLink} onChange={handleInputChange} className="col-span-3" />
                          </div>
                        </div>
                        <Button onClick={handleAddArticle}>Add Article</Button>
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
                          <TableCell>${Number(item.unitPrice).toFixed(2)}</TableCell>
                          <TableCell>{item.weightCbm}</TableCell>
                          <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
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
                  <h3 className="text-lg font-semibold mb-2">Calculations</h3>
                  {/* Add calculations section here */}
                </div>

                {/* Conditions */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Conditions</h3>
                  {/* Add conditions section here */}
                </div>

                <Button onClick={() => console.log("Create Invoice", newInvoice)}>Create Invoice</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Invoice List</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add invoice list table here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}