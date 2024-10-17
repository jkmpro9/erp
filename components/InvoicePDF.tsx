import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
});

// Define the props interface for InvoicePDF
interface InvoicePDFProps {
  invoice: {
    id: string;
    clientName: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
  };
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>COCCINELLE SARL</Text>
        <Text>Facture No : {invoice.id}</Text>
        <Text>Date Facture : {new Date().toISOString().split('T')[0]}</Text>
        <Text>CLIENT(E): {invoice.clientName}</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>DESCRIPTION</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>QTY</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>PRIX UNIT</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>MONTANT</Text>
            </View>
          </View>
          {/* Table body */}
          {invoice.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.unitPrice}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity * item.unitPrice}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* Add totals and other invoice details here */}
    </Page>
  </Document>
);

export default InvoicePDF;
