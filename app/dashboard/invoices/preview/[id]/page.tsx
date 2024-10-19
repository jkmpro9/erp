'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import InvoiceCalculator from '@/components/SomeComponent';

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
    flexDirection: 'row',
    marginBottom: 20,
  },
  headerLeft: {
    width: '70%',
    backgroundColor: '#E6F3F0',
    padding: 15,
  },
  headerRight: {
    width: '30%',
    backgroundColor: '#2E7D63',
    padding: 15,
    color: 'white',
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D63',
    marginBottom: 10,
  },
  companyInfo: {
    fontSize: 9,
    color: '#333',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  invoiceInfo: {
    fontSize: 10,
    color: 'white',
    marginBottom: 5,
  },
  invoiceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  invoiceInfoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  invoiceInfoValue: {
    fontSize: 10,
    color: 'white',
  },
  mainContent: {
    marginTop: 20,
  },
  clientInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 20,
  },
  clientInfoColumn: {
    width: '48%',
  },
  clientInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '30%',
  },
  value: {
    fontSize: 10,
    width: '70%',
  },
  rightLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '40%',
    textTransform: 'uppercase',
  },
  rightValue: {
    fontSize: 10,
    width: '60%',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#2E7D63', // Couleur verte du thème
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#2E7D63', // Couleur verte du thème
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 80,
    textAlign: 'center',
  },
  tableRowEven: {
    backgroundColor: '#F0F8F6', // Couleur de fond légère pour les lignes paires
  },
  tableRowOdd: {
    backgroundColor: '#FFFFFF', // Couleur de fond pour les lignes impaires
  },
  tableRowHeader: {
    backgroundColor: '#2E7D63', // Couleur verte du thème pour l'en-tête
    minHeight: 40,
  },
  tableColSmall: {
    width: '7%',
    borderRightColor: '#2E7D63', // Couleur verte du thème
    borderRightWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  tableColMedium: {
    width: '12%',
    borderRightColor: '#2E7D63', // Couleur verte du thème
    borderRightWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  tableColLarge: {
    width: '35%',
    borderRightColor: '#2E7D63', // Couleur verte du thème
    borderRightWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  tableColImage: {
    width: '15%',
    borderRightColor: '#2E7D63', // Couleur verte du thème
    borderRightWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  itemImage: {
    width: 80,
    height: 80,
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
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
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

const InvoicePreviewPage: React.FC = () => {
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
            console.log('Processing item:', item); // Ajoutez ce log pour voir la structure de chaque item
            const imageUrl = item.imageUrl || item.image || item.img || DEFAULT_IMAGE; // Ajout de 'img' comme autre possibilité
            console.log('Processing image URL:', imageUrl);
            try {
              const base64Image = await getBase64FromUrl(imageUrl);
              console.log('Base64 image loaded:', !!base64Image);
              return { ...item, imageUrl: base64Image };
            } catch (error) {
              console.error('Error loading image:', error);
              return { ...item, imageUrl: DEFAULT_IMAGE };
            }
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

  const formatInvoiceNumber = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const random = Math.floor(1000 + Math.random() * 9000); // Génère un nombre aléatoire entre 1000 et 9999
    return `COCCI${month}${year}-${random}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const InvoicePDF = () => {
    // Utilisez les valeurs pré-calculées de l'objet invoice
    const subtotal = invoice.subtotal || 0;
    const feeAmount = invoice.fees || 0;
    const transportAndCustoms = invoice.transport || 0;
    const total = invoice.total || 0;
    const feePercentage = invoice.feePercentage || 10; // Ajoutez cette ligne

    console.log('PDF Calculation:', { subtotal, feeAmount, transportAndCustoms, total, feePercentage });

    const invoiceNumber = formatInvoiceNumber(new Date(invoice.creationDate));
    const formattedDate = formatDate(invoice.creationDate);

    return (
      <Document>
        <Page size="A4" style={styles.page} wrap>
          <View style={styles.header} fixed={false}>
            <View style={styles.headerLeft}>
              <Text style={styles.companyName}>COCCINELLE</Text>
              <Text style={styles.companyInfo}>44, Kokolo, Q/Mbinza Pigeon, C/Ngaliema - Kinshasa</Text>
              <Text style={styles.companyInfo}>45, Avenue Nyangwe - Elie Mbayo, Q/Lido, C/Lubumbashi</Text>
              <Text style={styles.companyInfo}>243970764213 / 243851958937</Text>
              <Text style={styles.companyInfo}>sales@coccinelledrc.com</Text>
              <Text style={styles.companyInfo}>www.coccinelledrc.com</Text>
              <Text style={styles.companyInfo}>8617858307921</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.invoiceTitle}>FACTURE</Text>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>Facture No.:</Text>
                <Text style={styles.invoiceInfoValue}>{invoiceNumber}</Text>
              </View>
              <View style={styles.invoiceInfoRow}>
                <Text style={styles.invoiceInfoLabel}>Date Facture:</Text>
                <Text style={styles.invoiceInfoValue}>{formattedDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.mainContent}>
            {/* Remontée de la section des informations du client */}
            <View style={[styles.clientInfoSection, { marginTop: 10 }]}>
              <View style={styles.clientInfoColumn}>
                <View style={styles.clientInfoRow}>
                  <Text style={styles.label}>CLIENT(E):</Text>
                  <Text style={styles.value}>{invoice.clientName}</Text>
                </View>
                <View style={styles.clientInfoRow}>
                  <Text style={styles.label}>LIEU:</Text>
                  <Text style={styles.value}>{invoice.clientAddress}</Text>
                </View>
                <View style={styles.clientInfoRow}>
                  <Text style={styles.label}>PHONE:</Text>
                  <Text style={styles.value}>{invoice.clientPhone}</Text>
                </View>
              </View>
              <View style={styles.clientInfoColumn}>
                <View style={styles.clientInfoRow}>
                  <Text style={styles.rightLabel}>LIVRAISON:</Text>
                  <Text style={styles.rightValue}>{invoice.deliveryLocation.toUpperCase()}</Text>
                </View>
                <View style={styles.clientInfoRow}>
                  <Text style={styles.rightLabel}>METHODE:</Text>
                  <Text style={styles.rightValue}>{invoice.deliveryMethod.toUpperCase()}</Text>
                </View>
                <View style={styles.clientInfoRow}>
                  <Text style={styles.rightLabel}>VENDEUR:</Text>
                  <Text style={styles.rightValue}>
                    {invoice.createdBy ? invoice.createdBy.toUpperCase() : 'N/A'}
                  </Text>
                </View>
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
                <View style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]} key={index}>
                  <View style={styles.tableColSmall}><Text style={styles.tableCell}>{index + 1}</Text></View>
                  <View style={styles.tableColImage}>
                    <Image src={item.imageUrl} style={styles.itemImage} />
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
                      ${(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
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
                  <Text style={styles.calculationValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>FRAIS ({feePercentage}%)</Text>
                  <Text style={styles.calculationValue}>${feeAmount.toFixed(2)}</Text>
                </View>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>TRANSPORT & DOUANE</Text>
                  <Text style={styles.calculationValue}>${transportAndCustoms.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalRowLabel}>TOTAL GENERALE</Text>
                  <Text style={styles.totalRowValue}>${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer} fixed={false} render={({ pageNumber }) => (
            <View style={styles.footerSection}>
              <Text style={styles.footerText}>Page {pageNumber}</Text>
              <Text style={styles.footerText}>EQUITY BCDC | 00011105023-32000099901-60 | COCCINELLE RAWBANK | 04011-04410018001-91 |</Text>
              <Text style={styles.footerText}>COCCINELLE SARL</Text>
              <Text style={styles.footerText}>RCCM: CD/KNG/RCCM/21-B-02464 | ID.NAT: 01-4300-N89711B | IMPOT: A2173499P</Text>
              <Text style={styles.footerText}>Email: sales@coccinelledrc.com | Site Web: www.coccinelledrc.com</Text>
            </View>
          )} />
        </Page>
      </Document>
    );
  };

  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <InvoicePDF />
      </PDFViewer>
    </div>
  );
}

export default InvoicePreviewPage;
