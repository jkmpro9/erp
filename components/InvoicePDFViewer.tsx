import { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

interface InvoicePDFViewerProps {
  invoice: any; // Replace 'any' with your actual Invoice type
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

const InvoicePDFViewer: React.FC<InvoicePDFViewerProps> = ({ invoice }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <PDFViewer width="100%" height={600}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Invoice PDF Content</Text>
            <Text>{invoice.id}</Text>
            <Text>{invoice.clientName}</Text>
            {/* Add more invoice details here */}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDFViewer;
