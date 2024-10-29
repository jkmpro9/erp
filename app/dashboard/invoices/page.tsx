/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, use } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import localforage from "@/lib/localForage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link, Pencil, Trash, FileText, Search, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast, useToast } from "@/components/ui/use-toast";
import Papa from "papaparse"; // Assurez-vous d'installer papaparse : npm install papaparse @types/papaparse
import { getBase64FromUrl } from "@/utils/imageUtils"; // Assurez-vous d'avoir cette fonction utilitaire
import { format } from "date-fns";

// Ajoutez cette ligne après les imports
const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// Importez dynamiquement le composant de prévisualisation PDF
const DynamicInvoicePDFViewer = dynamic(
  () => import("../invoices/preview/[id]/page"),
  {
    ssr: false,
    loading: () => <p>Chargement de l&apos;aperçu PDF...</p>,
  }
);

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
  subtotal: number; // Ajouté
  fees: number; // Ajouté
  transport: number; // Ajouté
  total: number; // Ajouté
}

interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface Draft
  extends Omit<Invoice, "id" | "creationDate" | "amount" | "createdBy"> {
  createdBy: string;
  id: string;
  creationDate: string;
  lastModified: string; // Ajoutez cette ligne
}

export default function InvoicesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"list" | "create" | "drafts">(
    "list"
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [newInvoice, setNewInvoice] = useState<
    Omit<Invoice, "creationDate" | "amount">
  >({
    id: "",
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    deliveryLocation: "",
    deliveryMethod: "",
    items: [],
    subtotal: 0,
    fees: 0,
    transport: 0,
    total: 0,
    createdBy: "",
  });
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  const [newArticle, setNewArticle] = useState<Article>({
    imageUrl: "",
    description: "",
    quantity: 0,
    unitPrice: 0,
    weightCbm: 0,
    itemLink: "",
  });

  const [subtotal, setSubtotal] = useState(0);
  const [fees, setFees] = useState(0);
  const [transport, setTransport] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [feePercentage, setFeePercentage] = useState(10);

  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [clients, setClients] = useState<Client[]>([]);

  const [showPDFViewer, setShowPDFViewer] = useState(false);

  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingDraft, setIsEditingDraft] = useState(false);

  // Fonction de filtrage
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "paid" && invoice.amount > 0) ||
      (filterStatus === "unpaid" && invoice.amount === 0);
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    const loadData = async () => {
      const storedInvoices = await localforage.getItem<Invoice[]>("invoices");
      if (storedInvoices) {
        setInvoices(storedInvoices);
      }

      const storedDrafts = await localforage.getItem<Draft[]>("drafts");
      if (storedDrafts) {
        setDrafts(storedDrafts);
      }

      const storedClients = await localforage.getItem<Client[]>("clients");
      if (storedClients) {
        setClients(storedClients);
      }
    };

    loadData();
  }, []);

  const handlePreviewPDF = () => {
    const subtotal = newInvoice.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const fees = subtotal * (feePercentage / 100);
    const total = subtotal + fees + transport;

    const currentDate = new Date();
    const invoiceNumber = `COCCI${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${currentDate
      .getFullYear()
      .toString()
      .slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const previewInvoice = {
      ...newInvoice,
      id: invoiceNumber,
      creationDate: currentDate.toISOString().split("T")[0],
      subtotal: subtotal,
      fees: fees,
      feePercentage: feePercentage,
      transport: transport,
      total: total,
      createdBy: newInvoice.createdBy, // Utilisez la valeur choisie par l'utilisateur
    };

    console.log("Preview Invoice:", previewInvoice);

    localStorage.setItem("previewInvoice", JSON.stringify(previewInvoice));
    setShowPDFViewer(true);
  };

  const createPreviewInvoice = (): Invoice => {
    const subtotal = newInvoice.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const fees = subtotal * 0.1; // 10% de frais
    const transport = 0; // Vous pouvez ajuster cela selon vos besoins
    const total = subtotal + fees + transport;

    return {
      id: `PREVIEW-${Date.now()}`,
      clientName: newInvoice.clientName,
      creationDate: new Date().toISOString().split("T")[0],
      amount: total,
      createdBy: "Current User", // Remplacez par l'utilisateur actuel si disponible
      clientPhone: newInvoice.clientPhone,
      clientAddress: newInvoice.clientAddress,
      deliveryLocation: newInvoice.deliveryLocation,
      deliveryMethod: newInvoice.deliveryMethod,
      items: newInvoice.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        total: Number(item.quantity) * Number(item.unitPrice),
      })),
      subtotal,
      fees,
      transport,
      total,
    };
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    // Add content to the PDF
    doc.text("COCCINELLE SARL", 10, 10);
    doc.text(`Facture No : ${createPreviewInvoice().id}`, 10, 20);
    doc.text(`Date Facture : ${createPreviewInvoice().creationDate}`, 10, 30);
    doc.text(`CLIENT(E): ${createPreviewInvoice().clientName}`, 10, 40);
    // ... add more invoice details

    // Save the PDF
    doc.save("invoice.pdf");
  };

  useEffect(() => {
    const newSubtotal = newInvoice.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const newTotalQuantity = newInvoice.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const newTotalWeight = newInvoice.items.reduce(
      (sum, item) => sum + (Number(item.weightCbm) || 0),
      0
    );
    const newFees = (newSubtotal * feePercentage) / 100;
    const newTotal = newSubtotal + newFees + transport;

    setSubtotal(newSubtotal);
    setTotalQuantity(newTotalQuantity);
    setTotalWeight(newTotalWeight);
    setFees(newFees);
    setTotal(newTotal);
  }, [newInvoice.items, feePercentage, transport]);

  const handleRemoveAllItems = () => {
    setNewInvoice({ ...newInvoice, items: [] });
  };

  const handleAddArticle = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, newArticle],
    });
    setNewArticle({
      imageUrl: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      weightCbm: 0,
      itemLink: "",
    });
    setIsAddArticleOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleClientSelect = (clientId: string) => {
    const selectedClient = clients.find((client) => client.id === clientId);
    if (selectedClient) {
      setNewInvoice({
        ...newInvoice,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
        clientAddress: selectedClient.address,
      });
    }
  };

  const handleClientInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const handleCreateInvoice = async () => {
    const newId = `FAC${(invoices.length + 1).toString().padStart(3, "0")}`;
    const amount = newInvoice.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
    const newInvoiceWithId: Invoice = {
      ...newInvoice,
      id: newId,
      creationDate: new Date().toISOString().split("T")[0],
      amount,
      createdBy: "Current User", // Replace with actual logged-in user
    };
    const updatedInvoices = [...invoices, newInvoiceWithId];
    setInvoices(updatedInvoices);
    await localforage.setItem("invoices", updatedInvoices);
    setNewInvoice({
      id: "", // Ajoutez cette ligne pour corriger l'erreur de type
      clientName: "",
      clientPhone: "",
      clientAddress: "",
      deliveryLocation: "",
      deliveryMethod: "",
      items: [],
      subtotal: 0,
      fees: 0,
      transport: 0,
      total: 0,
      createdBy: "",
    });
  };

  const handleEditItem = (index: number) => {
    setEditingItemIndex(index);
    const itemToEdit = newInvoice.items[index];
    setNewArticle({ ...itemToEdit });
    setIsAddArticleOpen(true);
  };

  const handleUpdateItem = () => {
    if (editingItemIndex !== null) {
      const updatedItems = [...newInvoice.items];
      updatedItems[editingItemIndex] = newArticle;
      setNewInvoice({ ...newInvoice, items: updatedItems });
      setEditingItemIndex(null);
    } else {
      handleAddArticle();
    }
    setIsAddArticleOpen(false);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const handleCreateDraft = async () => {
    const currentDate = new Date().toISOString();
    const newDraft: Draft = {
      ...newInvoice,
      id: `DRAFT${Date.now()}`,
      creationDate: currentDate.split("T")[0],
      lastModified: currentDate, // Ajoutez cette ligne
    };
    const updatedDrafts = [...drafts, newDraft];
    setDrafts(updatedDrafts);
    await localforage.setItem("drafts", updatedDrafts);
    setNewInvoice({
      id: "", // Ajoutez cette ligne pour corriger l'erreur de type
      clientName: "",
      clientPhone: "",
      clientAddress: "",
      deliveryLocation: "",
      deliveryMethod: "",
      items: [],
      subtotal: 0,
      fees: 0,
      transport: 0,
      total: 0,
      createdBy: "", // Ajoutez cette ligne
    });
  };
  const handleEditDraft = (draft: Draft) => {
    const updatedDraft = {
      ...draft,
      lastModified: new Date().toISOString(),
    };
    setNewInvoice(updatedDraft);
    setIsEditingDraft(true);
    setActiveTab("create");
  };

  const handleDeleteDraft = async (draftId: string) => {
    const updatedDrafts = drafts.filter((draft) => draft.id !== draftId);
    setDrafts(updatedDrafts);
    await localforage.setItem("drafts", updatedDrafts);
  };

  const calculateTotal = (items: Article[]): number => {
    return items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  };

  const handleConvertDraftToInvoice = async (draft: Draft) => {
    // Validation
    if (!draft.clientName || draft.items.length === 0) {
      toast({
        title: "Erreur de validation",
        content: "Le nom du client et au moins un article sont requis.",
        variant: "destructive",
      });
      return;
    }

    // La confirmation sera gérée par l'AlertDialog

    // Conversion
    const newInvoice: Invoice = {
      ...draft,
      id: `FAC${(invoices.length + 1).toString().padStart(3, "0")}`,
      creationDate: new Date().toISOString().split("T")[0],
      amount: calculateTotal(draft.items),
      createdBy: "Current User", // Remplacer par l'utilisateur actuel
    };

    // Mise à jour de l'état
    setInvoices([...invoices, newInvoice]);
    setDrafts(drafts.filter((d) => d.id !== draft.id));

    // Sauvegarde
    await localforage.setItem("invoices", [...invoices, newInvoice]);
    await localforage.setItem(
      "drafts",
      drafts.filter((d) => d.id !== draft.id)
    );

    toast({
      title: "Brouillon converti",
      content: `Le brouillon a été converti en facture ${newInvoice.id}`,
    });
  };
  const handleResetInvoice = () => {
    setNewInvoice({
      id: "", // Ajoutez cette ligne pour satisfaire la signature de type
      clientName: "",
      clientPhone: "",
      clientAddress: "",
      deliveryLocation: "",
      deliveryMethod: "",
      items: [],
      subtotal: 0,
      fees: 0,
      transport: 0,
      total: 0,
      createdBy: "",
    });
    setSubtotal(0);
    setFees(0);
    setTransport(0);
    setTotal(0);
    setTotalQuantity(0);
    setTotalWeight(0);
    toast({
      title: "Nouvelle facture",
      content: "Le formulaire a été réinitialisé pour une nouvelle facture.",
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: async (result) => {
          const parsedData = result.data as string[][];
          // Ignorer la première ligne (en-têtes)
          const items = parsedData.slice(1).map((row) => ({
            imageUrl: row[1], // Ceci est déjà une chaîne base64
            quantity: parseInt(row[2].trim(), 10),
            description: row[3],
            unitPrice: parseFloat(row[4].replace("$", "").trim()),
            weightCbm: parseFloat(row[5]),
            total: parseFloat(row[6].replace("$", "").trim()),
            itemLink: row[7],
          }));

          setNewInvoice((prevInvoice) => ({
            ...prevInvoice,
            items: items,
          }));

          console.log("Données CSV chargées:", items);
          setIsFileUploadOpen(false);
          toast({
            title: "Fichier chargé avec succès",
            content: `${items.length} articles ont été ajoutés à la facture.`,
          });
        },
        header: false,
        skipEmptyLines: true,
      });
    }
  };

  const handleFileUploadClick = () => {
    setIsFileUploadOpen(true);
  };

  const handleFileUploadConfirm = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVendorChange = (value: string) => {
    setNewInvoice((prev) => ({ ...prev, createdBy: value }));
  };

  const handleCreateOrUpdateDraft = async () => {
    const currentDate = new Date().toISOString();
    if (isEditingDraft) {
      // Updating the existing draft
      const updatedDrafts = drafts.map((draft) =>
        draft.id === newInvoice.id
          ? { ...draft, ...newInvoice, lastModified: currentDate }
          : draft
      );
      setDrafts(updatedDrafts);
      await localforage.setItem("drafts", updatedDrafts);
      toast({
        title: "Brouillon mis à jour",
        content: "Le brouillon a été mis à jour avec succès.",
      });
    } else {
      // Création d'un nouveau brouillon
      const newDraft: Draft = {
        ...newInvoice,
        id: `DRAFT${Date.now()}`,
        creationDate: currentDate.split("T")[0],
        lastModified: currentDate,
      };
      const updatedDrafts = [...drafts, newDraft];
      setDrafts(updatedDrafts);
      await localforage.setItem("drafts", updatedDrafts);
      toast({
        title: "Brouillon créé",
        content: "Un nouveau brouillon a été créé avec succès.",
      });
    }
    setIsEditingDraft(false);
    handleResetInvoice();
  };

  const handleCancelInvoice = async (invoiceId: string) => {
    const updatedInvoices = invoices.filter(
      (invoice) => invoice.id !== invoiceId
    );
    setInvoices(updatedInvoices);
    await localforage.setItem("invoices", updatedInvoices);
    toast({
      title: "Facture annulée",
      content: "La facture a été annulée avec succès.",
    });
  };

  const handleViewUserDetails = (userId: string) => {
    // Rediriger vers la page de détails de l'utilisateur
    router.push(`/dashboard/users/${userId}`);
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
                  variant={activeTab === "list" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("list")}
                >
                  Liste des Factures
                </Button>
                <Button
                  variant={activeTab === "create" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("create")}
                >
                  Créer une Facture
                </Button>
                <Button
                  variant={activeTab === "drafts" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("drafts")}
                >
                  Brouillons
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {activeTab === "list" && (
            <Card>
              <CardHeader>
                <CardTitle>Liste des Factures</CardTitle>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une facture..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les factures</SelectItem>
                      <SelectItem value="paid">Factures payées</SelectItem>
                      <SelectItem value="unpaid">
                        Factures non payées
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom du Client</TableHead>
                      <TableHead>Date de Création</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Créé Par</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>
                          {format(
                            new Date(invoice.creationDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            onClick={() =>
                              handleViewUserDetails(invoice.createdBy)
                            }
                          >
                            {invoice.createdBy}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewPDF()}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF()}
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Êtes-vous sûr de vouloir annuler cette facture
                                  ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action ne peut pas être annulée. Cela
                                  supprimera définitivement la facture.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleCancelInvoice(invoice.id)
                                  }
                                >
                                  Confirmer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "drafts" && (
            <Card>
              <CardHeader>
                <CardTitle>Liste des Brouillons</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Brouillon</TableHead>
                      <TableHead>Nom du Client</TableHead>
                      <TableHead>Date de Création</TableHead>
                      <TableHead>Dernière Modification</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drafts.map((draft) => (
                      <TableRow key={draft.id}>
                        <TableCell>{draft.id}</TableCell>
                        <TableCell>{draft.clientName}</TableCell>
                        <TableCell>{draft.creationDate}</TableCell>
                        <TableCell>
                          {new Date(draft.lastModified).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDraft(draft)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDraft(draft.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Convertir en facture
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir convertir ce
                                  brouillon en facture ?
                                  <br />
                                  Client: {draft.clientName}
                                  <br />
                                  Total: $
                                  {calculateTotal(draft.items).toFixed(2)}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleConvertDraftToInvoice(draft)
                                  }
                                >
                                  Convertir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === "create" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Créer une Nouvelle Facture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-6">
                  <div className="flex-1 space-y-6">
                    {/* Client Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Informations du Client
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="clientName">Nom du Client</Label>
                          <Select onValueChange={handleClientSelect}>
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
                          <Label htmlFor="clientPhone">
                            Téléphone du Client
                          </Label>
                          <Input
                            id="clientPhone"
                            value={newInvoice.clientPhone}
                            onChange={(e) =>
                              setNewInvoice({
                                ...newInvoice,
                                clientPhone: e.target.value,
                              })
                            }
                            placeholder="Téléphone du client"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientAddress">
                            Adresse du Client
                          </Label>
                          <Input
                            id="clientAddress"
                            value={newInvoice.clientAddress}
                            onChange={(e) =>
                              setNewInvoice({
                                ...newInvoice,
                                clientAddress: e.target.value,
                              })
                            }
                            placeholder="Adresse du client"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label htmlFor="deliveryLocation">
                            Lieu de Livraison
                          </Label>
                          <Select
                            name="deliveryLocation"
                            onValueChange={(value) =>
                              handleClientInfoChange({
                                target: { name: "deliveryLocation", value },
                              } as any)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le lieu de livraison" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lubumbashi">
                                Lubumbashi
                              </SelectItem>
                              <SelectItem value="kinshasa">Kinshasa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="deliveryMethod">
                            Méthode de Livraison
                          </Label>
                          <Select
                            name="deliveryMethod"
                            onValueChange={(value) =>
                              handleClientInfoChange({
                                target: { name: "deliveryMethod", value },
                              } as any)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la méthode de livraison" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="air">Air</SelectItem>
                              <SelectItem value="sea">Mer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="vendor">Vendeur</Label>
                          <Select
                            onValueChange={handleVendorChange}
                            value={newInvoice.createdBy}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le vendeur" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="John Doe">John Doe</SelectItem>
                              <SelectItem value="Jane Smith">
                                Jane Smith
                              </SelectItem>
                              {/* Ajoutez d'autres vendeurs selon vos besoins */}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold mb-2">Articles</h3>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Button
                          variant="destructive"
                          onClick={handleRemoveAllItems}
                        >
                          Effacer tous les Articles
                        </Button>
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
                                <img
                                  src={item.imageUrl}
                                  alt={item.description}
                                  className="w-12 h-12 object-cover"
                                />
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>
                                ${Number(item.unitPrice).toFixed(2)}
                              </TableCell>
                              <TableCell>{item.weightCbm}</TableCell>
                              <TableCell>
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={item.itemLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Link className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditItem(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Êtes-vous sûr ?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action ne peut pas être annulée.
                                          Cela supprimera définitivement cet
                                          article de la facture.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Annuler
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeleteItem(index)
                                          }
                                        >
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-end mt-4">
                        <Dialog
                          open={isAddArticleOpen}
                          onOpenChange={setIsAddArticleOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Ajouter un Article
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {editingItemIndex !== null
                                  ? "Modifier l'Article"
                                  : "Ajouter un Nouveau Article"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="imageUrl"
                                  className="text-right"
                                >
                                  URL de l&apos;Image
                                </Label>
                                <Input
                                  id="imageUrl"
                                  name="imageUrl"
                                  value={newArticle.imageUrl}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="description"
                                  className="text-right"
                                >
                                  Description
                                </Label>
                                <Input
                                  id="description"
                                  name="description"
                                  value={newArticle.description}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="quantity"
                                  className="text-right"
                                >
                                  Quantité
                                </Label>
                                <Input
                                  id="quantity"
                                  name="quantity"
                                  type="number"
                                  value={newArticle.quantity}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="unitPrice"
                                  className="text-right"
                                >
                                  Prix Unitaire
                                </Label>
                                <Input
                                  id="unitPrice"
                                  name="unitPrice"
                                  type="number"
                                  value={newArticle.unitPrice}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="weightCbm"
                                  className="text-right"
                                >
                                  Poids/CBM
                                </Label>
                                <Input
                                  id="weightCbm"
                                  name="weightCbm"
                                  type="number"
                                  value={newArticle.weightCbm}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="itemLink"
                                  className="text-right"
                                >
                                  Lien de l&apos;Article
                                </Label>
                                <Input
                                  id="itemLink"
                                  name="itemLink"
                                  value={newArticle.itemLink}
                                  onChange={handleInputChange}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <Button onClick={handleUpdateItem}>
                              {editingItemIndex !== null
                                ? "Mettre à jour l'Article"
                                : "Ajouter l'Article"}
                            </Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  {/* Calculations - Moved to the right side */}
                  <div className="w-1/3 space-y-4">
                    <Card className="bg-gray-800">
                      <CardContent className="p-4 space-y-4">
                        <div className="bg-blue-900 p-2 rounded flex justify-between items-center">
                          <span className="font-semibold text-white">
                            SOUS-TOTAL
                          </span>
                          <span className="font-semibold text-white">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-gray-300">
                          Quantité Totale: {totalQuantity} pcs
                        </div>
                        <div className="flex items-center justify-between text-gray-300">
                          <span>FRAIS</span>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={feePercentage.toString()}
                              onValueChange={(value) =>
                                setFeePercentage(Number(value))
                              }
                            >
                              <SelectTrigger className="w-[80px] bg-gray-700 text-white">
                                <SelectValue placeholder="%" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="10">10%</SelectItem>
                                <SelectItem value="15">15%</SelectItem>
                              </SelectContent>
                            </Select>
                            <span>${fees.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="bg-gray-700 p-2 rounded">
                          <div className="flex items-center justify-between text-gray-300">
                            <span>
                              TRANSPORT & DOUANE ({newInvoice.deliveryMethod})
                            </span>
                            <Input
                              type="number"
                              value={transport}
                              onChange={(e) =>
                                setTransport(Number(e.target.value))
                              }
                              className="w-[100px] bg-gray-600 text-white"
                            />
                          </div>
                          <div className="mt-2 text-gray-300">
                            Poids Total: {totalWeight.toFixed(2)} kg
                          </div>
                        </div>
                        <div className="bg-green-800 p-2 rounded flex justify-between items-center">
                          <span className="font-semibold text-white">
                            TOTAL GENERAL
                          </span>
                          <span className="font-semibold text-white">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Conditions */}
                    <Card className="bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white">
                          Conditions Générales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Entrez les conditions générales ici..."
                          value="Délais de livraison : 10 -15 Jours selon le types de marchandises"
                          rows={3}
                          className="bg-gray-700 text-white"
                        />
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleCreateOrUpdateDraft}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isEditingDraft
                          ? "Modifier le Brouillon"
                          : "Créer un Brouillon"}
                      </Button>
                      <Button
                        onClick={handlePreviewPDF}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        APERÇU PDF
                      </Button>
                      <Button
                        onClick={handleFileUploadClick}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        CHARGER FICHIER
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showPDFViewer && (
        <Dialog open={showPDFViewer} onOpenChange={setShowPDFViewer}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Aperçu de la facture</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Voici un aperçu de la facture que vous avez créée. Vous pouvez la
              vérifier avant de la finaliser.
            </DialogDescription>
            <DynamicInvoicePDFViewer />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isFileUploadOpen} onOpenChange={setIsFileUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Charger un fichier CSV</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              style={{ display: "none" }}
            />
            <Button onClick={handleFileUploadConfirm}>
              Sélectionner un fichier
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsFileUploadOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleFileUploadConfirm}>Charger</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
