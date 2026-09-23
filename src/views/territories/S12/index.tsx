import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryTemplateProps } from '../index.types';
import CardBack from '../shared/CardBack';
import CardFront from '../shared/CardFront';

const CUT = '0.5px dashed #BDBDBD';

// where Figma places the cut areas, front above back
const WIDTH = 467;
const HEIGHT = 301;
const LEFT = 64;
const TOP = 120;

const TemplateTerritoryS12 = ({
  territories,
  lang,
  printedOn,
  parts,
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
          {parts.front && (
            <CardFront territory={territory} width={WIDTH} height={HEIGHT} />
          )}

          {parts.back && (
            <CardBack
              territory={territory}
              width={WIDTH}
              height={HEIGHT}
              rowsPerColumn={7}
              notes={territory.notes}
              printedOn={printedOn}
            />
          )}
        </View>
      </Page>
    ))}
  </Document>
);

export default TemplateTerritoryS12;
