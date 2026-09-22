import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';

const CUT = '0.5px dashed #BDBDBD';
import { TerritoryTemplateProps } from '../index.types';
import CardBack from '../shared/CardBack';
import CardFront from '../shared/CardFront';

// the card is cut out of the sheet, so both halves sit where Figma places the
// cut areas: 467 x 301 pt, centred, front above back
const WIDTH = 467;
const HEIGHT = 301;
const LEFT = 64;
const TOP = 120;

const TemplateTerritoryS12 = ({
  territories,
  lang,
  showMap = true,
  printedOn,
}: TerritoryTemplateProps) => (
  <Document title="S-12" lang={lang}>
    {territories.map((territory) => (
      <Page key={territory.id} size="A4" style={{ backgroundColor: '#FFFFFF' }}>
        <View
          wrap={false}
          style={{
            marginTop: TOP,
            marginLeft: LEFT,
            width: WIDTH,
            border: CUT,
          }}
        >
          <CardFront
            territory={territory}
            width={WIDTH}
            height={HEIGHT}
            showMap={showMap}
          />

          <CardBack
            territory={territory}
            width={WIDTH}
            height={HEIGHT}
            rowsPerColumn={7}
            notes={territory.notes}
            printedOn={printedOn}
          />
        </View>
      </Page>
    ))}
  </Document>
);

export default TemplateTerritoryS12;
