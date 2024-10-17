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
  }
});

// Define props interface
interface InvoicePDFProps {
  invoiceData: {
    invoiceNumber: string;
    date: string;
    clientName: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
    total: number;
  };
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Invoice Number: {invoiceData.invoiceNumber}</Text>
        <Text>Date: {invoiceData.date}</Text>
        <Text>Client: {invoiceData.clientName}</Text>
      </View>
      <View style={styles.section}>
        {invoiceData.items.map((item, index) => (
          <Text key={index}>
            {item.description} - Quantity: {item.quantity} - Unit Price: ${item.unitPrice}
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text>Total: ${invoiceData.total}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
