import { Image, Text, View } from '@react-pdf/renderer';
import styles from '../index.styles';

const QrNote = ({
  qrImage,
  printedOn,
}: {
  qrImage?: string;
  printedOn: string;
}) => (
  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-end' }}>
    <View style={{ gap: 8, width: 140 }}>
      <Text style={styles.qrText}>
        The latest info about this area is available in the Organized app.
        {qrImage ? ' Scan the QR code to view it.' : ''}
      </Text>
      <Text style={styles.printedOn}>Printed on {printedOn}</Text>
    </View>

    {qrImage && <Image src={qrImage} style={{ width: 60, height: 60 }} />}
  </View>
);

export default QrNote;
