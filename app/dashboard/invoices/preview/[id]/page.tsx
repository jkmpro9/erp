'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts (you'll need to add these font files to your project)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: '/fonts/Helvetica.ttf' },
    { src: '/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' },
  ]
});

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  companyInfo: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 10,
  },
  clientInfo: {
    width: '50%',
  },
  invoiceDetails: {
    width: '50%',
    alignItems: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    marginBottom: 5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 10,
    marginBottom: 10,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#bfbfbf',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    minHeight: 50, // Increased height for all rows
    textAlign: 'center',
  },
  tableRowHeader: {
    backgroundColor: '#008080',
    color: '#FFFFFF',
    minHeight: 30, // Reduced height for header
  },
  tableColSmall: {
    width: '8%', // Reduced width for NUM and QTY
    borderRightColor: '#bfbfbf',
    borderRightWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  tableColMedium: {
    width: '12%', // Medium width for IMAGE, PRIX UNIT, POIDS/CBM, MONTANT
    borderRightColor: '#bfbfbf',
    borderRightWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  tableColLarge: {
    width: '36%', // Increased width for DESCRIPTION
    borderRightColor: '#bfbfbf',
    borderRightWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'center',
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  tableCellDescription: {
    fontSize: 9,
    textAlign: 'left',
    paddingLeft: 5,
  },
  tableColImage: {
    width: '14.28%', // Same as other columns
    borderRightColor: '#bfbfbf',
    borderRightWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 40,  // Increased from 30
    height: 40, // Increased from 30
    objectFit: 'contain',
  },
  totals: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginBottom: 5,
  },
  totalItemLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalItemValue: {
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
  },
  calculationSection: {
    marginTop: 20,
    alignSelf: 'flex-end',
    width: '40%',
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  calculationLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  calculationValue: {
    fontSize: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: '#008080',
    padding: 5,
  },
  totalRowLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  totalRowValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  conditionsSection: {
    marginTop: 20,
    width: '55%',
  },
  conditionsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  conditionsText: {
    fontSize: 10,
    marginBottom: 5,
  },
  footerSection: {
    marginTop: 20,
    borderTop: '1 solid #008080',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },
});

// Ajoutez cette constante pour une image par défaut
const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Fonction améliorée pour convertir une URL d'image en base64
const getBase64FromUrl = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return DEFAULT_IMAGE; // Retourne l'image par défaut en cas d'erreur
  }
}

function getInvoice(id: string) {
  // Dans une vraie application, vous récupéreriez ces données depuis une API
  return {
    id: '20241004-162',
    clientName: 'ARMEL',
    clientPhone: '243 858 844 663',
    deliveryLocation: 'LUBUMBASHI',
    deliveryMethod: 'AVION',
    creationDate: '2024-10-04',
    items: [
      { num: 1, image: 'https://cbu01.alicdn.com/O1CN01i0rnHV1nsScw5Cr1C_!!2215843795145-0-cib.jpg', qty: 2, description: 'Suitable for UNO R3 learning kit', price: 14.87, weight: 0, total: 29.74 },
      { num: 2, image: 'https://cbu01.alicdn.com/img/ibank/O1CN011wKzRU2FZxtZ44mDx_!!2215643428895-0-cib.jpg', qty: 1, description: '830G5 i5-7th 8G+256G', price: 300.00, weight: 0, total: 300.00 },
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadInvoiceAndImages = async () => {
      const storedInvoice = localStorage.getItem('previewInvoice');
      if (storedInvoice) {
        const parsedInvoice = JSON.parse(storedInvoice);
        console.log('Parsed invoice:', parsedInvoice);
        
        // Convertir toutes les URLs d'images en base64
        const itemsWithBase64Images = await Promise.all(
          parsedInvoice.items.map(async (item: any) => {
            if (item.imageUrl) {
              console.log('Processing image URL:', item.imageUrl);
              const base64Image = await getBase64FromUrl(item.imageUrl);
              console.log('Base64 image loaded:', !!base64Image);
              return { ...item, imageUrl: base64Image };
            }
            return { ...item, imageUrl: DEFAULT_IMAGE };
          })
        );

        setInvoice({
          ...parsedInvoice,
          items: itemsWithBase64Images,
        });
        setImagesLoaded(true);
      }
    };

    loadInvoiceAndImages();
  }, [params.id]);

  if (!invoice || !imagesLoaded) {
    return <div>Chargement...</div>;
  }

  const InvoicePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>COCCINELLE SARL</Text>
          <Text style={styles.companyInfo}>14, Kokolo, Q/Matonge Pigeon, C/Ngaliema - Kinshasa</Text>
          <Text style={styles.companyInfo}>45, Avenue Nyangwe - Elie Mbayo, Q/Lido, C/Lubumbashi</Text>
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
            <Text style={styles.value}>Facture No : {invoice.id}</Text>
            <Text style={styles.value}>Date Facture : {invoice.creationDate}</Text>
            <Text style={styles.value}>LIVRAISON: {invoice.deliveryLocation}</Text>
            <Text style={styles.value}>METHODE: {invoice.deliveryMethod}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableRowHeader]}>
            <View style={styles.tableColSmall}><Text style={styles.tableCellHeader}>NUM</Text></View>
            <View style={styles.tableColImage}><Text style={styles.tableCellHeader}>IMAGE</Text></View>
            <View style={styles.tableColSmall}><Text style={styles.tableCellHeader}>QTY</Text></View>
            <View style={styles.tableColLarge}><Text style={styles.tableCellHeader}>DESCRIPTION</Text></View>
            <View style={styles.tableColMedium}><Text style={styles.tableCellHeader}>PRIX UNIT</Text></View>
            <View style={styles.tableColMedium}><Text style={styles.tableCellHeader}>POIDS/CBM</Text></View>
            <View style={styles.tableColMedium}><Text style={styles.tableCellHeader}>MONTANT</Text></View>
          </View>
          {invoice.items.map((item: any, index: number) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableColSmall}><Text style={styles.tableCell}>{index + 1}</Text></View>
              <View style={styles.tableColImage}>
                <Image src={item.imageUrl || DEFAULT_IMAGE} style={styles.itemImage} />
              </View>
              <View style={styles.tableColSmall}><Text style={styles.tableCell}>{item.quantity}</Text></View>
              <View style={styles.tableColLarge}>
                <Text style={styles.tableCellDescription}>{item.description}</Text>
              </View>
              <View style={styles.tableColMedium}>
                <Text style={styles.tableCell}>
                  ${typeof item.unitPrice === 'number' ? item.unitPrice.toFixed(2) : item.unitPrice}
                </Text>
              </View>
              <View style={styles.tableColMedium}>
                <Text style={styles.tableCell}>{item.weightCbm}</Text>
              </View>
              <View style={styles.tableColMedium}>
                <Text style={styles.tableCell}>
                  ${typeof item.total === 'number' ? item.total.toFixed(2) : item.total}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={styles.conditionsSection}>
            <Text style={styles.conditionsTitle}>Conditions Générales</Text>
            <Text style={styles.conditionsText}>Délais de livraison : 10-20 jours selon le types de marchandises</Text>
          </View>

          <View style={styles.calculationSection}>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>SOUS-TOTAL</Text>
              <Text style={styles.calculationValue}>
                ${invoice.subtotal ? invoice.subtotal.toFixed(2) : '0.00'}
              </Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>FRAIS (10%)</Text>
              <Text style={styles.calculationValue}>
                ${invoice.fees ? invoice.fees.toFixed(2) : '0.00'}
              </Text>
            </View>
            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>TRANSPORT & DOUANE</Text>
              <Text style={styles.calculationValue}>
                ${invoice.transport ? invoice.transport.toFixed(2) : '0.00'}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalRowLabel}>TOTAL GENERALE</Text>
              <Text style={styles.totalRowValue}>
                ${invoice.total ? invoice.total.toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>EQUITY BCDC | 00011105023-32000099901-60 | COCCINELLE RAWBANK | 04011-04410018001-91 |</Text>
          <Text style={styles.footerText}>COCCINELLE SARL</Text>
          <Text style={styles.footerText}>RCCM: CD/KNG/RCCM/21-B-02464 | ID.NAT: 01-4300-N89711B | IMPOT: A2173499P</Text>
          <Text style={styles.footerText}>Email: sales@coccinelledrc.com | Site Web: www.coccinelledrc.com</Text>
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
