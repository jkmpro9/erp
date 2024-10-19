import { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

interface InvoicePDFViewerProps {
  invoice: any; // Replace 'any' with your actual Invoice type
  client: any; // Replace 'any' with your actual Client type
  items: any[]; // Replace 'any[]' with your actual Items type
  transportAndCustoms: number; // Replace 'number' with your actual TransportAndCustoms type
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const InvoicePDFViewer: React.FC<InvoicePDFViewerProps> = ({ invoice, client, items, transportAndCustoms }) => {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const feeAmount = subtotal * 0.10;
  const total = subtotal + feeAmount + transportAndCustoms;

  return (
    <PDFViewer width="100%" height="600px">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Invoice PDF Content</Text>
            <Text>Invoice ID: {invoice.id}</Text>
            <Text>Client Name: {invoice.clientName}</Text>
            {/* Add more invoice details here */}
          </View>
          <View style={styles.section}>
            <Text>SOUS-TOTAL: ${subtotal.toFixed(2)}</Text>
            <Text>FRAIS (10%): ${feeAmount.toFixed(2)}</Text>
            <Text>TRANSPORT & DOUANE: ${transportAndCustoms.toFixed(2)}</Text>
            <Text>TOTAL GENERALE: ${total.toFixed(2)}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDFViewer;
