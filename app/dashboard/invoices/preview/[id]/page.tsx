'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  companyInfo: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  clientInfo: {
    width: '50%',
  },
  invoiceDetails: {
    width: '50%',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 10,
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    padding: 5,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
  },
});

function getInvoice(id: string) {
  // In a real app, you would fetch the invoice data from an API
  // For now, we'll just return dummy data
  return {
    id,
    clientName: 'ARMEL',
    clientPhone: '243 858 844 663',
    deliveryLocation: 'LUBUMBASHI',
    deliveryMethod: 'AVION',
    creationDate: '2024-10-04',
    items: [
      { num: 1, image: 'https://example.com/image1.jpg', qty: 2, description: 'Suitable for UNO R3 learning kit', price: 14.87, weight: 0, total: 29.74 },
      { num: 2, image: 'https://example.com/image2.jpg', qty: 1, description: '830G5 i5-7th 8G+256G', price: 300.00, weight: 0, total: 300.00 },
    ],
    subtotal: 329.74,
    fees: 32.97,
    transport: 31.50,
    total: 394.21,
  };
}

export default function InvoicePreviewPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const fetchedInvoice = getInvoice(params.id as string);
    setInvoice(fetchedInvoice);
  }, [params.id]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  const InvoicePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>COCCINELLE SARL</Text>
          <Text style={styles.companyInfo}>14, Kokolo, Q/Matonge Pigeon, C/Ngaliema - Kinshasa</Text>
          <Text style={styles.companyInfo}>45, Avenue Nyangwe - Elle Mbayo, Q/Lido, C/Lubumbashi</Text>
          <Text style={styles.companyInfo}>+243970764213 / +243859583397 / +8617858307921</Text>
          <Text style={styles.companyInfo}>sales@coccinelledrc.com | www.coccinelledrc.com</Text>
        </View>

        <Text style={styles.title}>FACTURE PROFORMA</Text>

        <View style={styles.invoiceInfo}>
          <View style={styles.clientInfo}>
            <Text style={styles.label}>CLIENT(E): {invoice.clientName}</Text>
            <Text style={styles.label}>LIEU:</Text>
            <Text style={styles.label}>PHONE: {invoice.clientPhone}</Text>
          </View>
          <View style={styles.invoiceDetails}>
            <Text style={styles.value}>Facture No: {invoice.id}</Text>
            <Text style={styles.value}>Date Facture: {invoice.creationDate}</Text>
            <Text style={styles.value}>LIVRAISON: {invoice.deliveryLocation}</Text>
            <Text style={styles.value}>METHODE: {invoice.deliveryMethod}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>NUM</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>IMAGE</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>QTY</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>DESCRIPTION</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>PRIX UNIT</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>POIDS/CBM</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>MONTANT</Text>
            </View>
          </View>
          {invoice.items.map((item: any, index: number) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.num}</Text>
              </View>
              <View style={styles.tableCol}>
                <Image src={item.image} style={{ width: 30, height: 30 }} />
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.qty}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.weight}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>${item.total.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>SOUS-TOTAL</Text>
              <Text style={styles.totalValue}>${invoice.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>FRAIS (10%)</Text>
              <Text style={styles.totalValue}>${invoice.fees.toFixed(2)}</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>TRANSPORT & DOUANE</Text>
              <Text style={styles.totalValue}>${invoice.transport.toFixed(2)}</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>TOTAL GENERALE</Text>
              <Text style={styles.totalValue}>${invoice.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Conditions Générales</Text>
          <Text>Délais de livraison : 10-20 jours selon le types de marchandises</Text>
          <Text>EQUITY BCDC | 00011105023-32000099901-60 | COCCINELLE RAWBANK | 04011-04410018001-91 |</Text>
          <Text>COCCINELLE SARL</Text>
          <Text>RCCM: CD/KNG/RCCM/21-B-02464 | ID.NAT: 01-4300-N89711B | IMPOT: A2173499P</Text>
          <Text>Email: sales@coccinelledrc.com | Site Web: www.coccinelledrc.com</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <InvoicePDF />
      </PDFViewer>
    </div>
  );
}
