import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  totals: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    border: '1px solid black'
  },
  total: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  }
});

// Define props interface
interface InvoicePDFProps {
  invoice: {
    invoiceNumber: string;
    date: string;
    clientName: string;
  };
  client: {
    name: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  transportAndCustoms: number;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, client, items, transportAndCustoms }) => {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const feeAmount = (subtotal * 0.10);
  const total = subtotal + feeAmount + transportAndCustoms;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Invoice Number: {invoice.invoiceNumber}</Text>
          <Text>Date: {invoice.date}</Text>
          <Text>Client: {client.name}</Text>
        </View>
        <View style={styles.section}>
          {items.map((item, index) => (
            <Text key={index}>
              {item.description} - Quantity: {item.quantity} - Unit Price: ${item.unitPrice}
            </Text>
          ))}
        </View>
        <View style={styles.totals}>
          <Text>SOUS-TOTAL: ${subtotal.toFixed(2)}</Text>
          <Text>FRAIS (10%): ${feeAmount.toFixed(2)}</Text>
          <Text>TRANSPORT & DOUANE: ${transportAndCustoms.toFixed(2)}</Text>
          <Text style={styles.total}>TOTAL GENERALE: ${total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
