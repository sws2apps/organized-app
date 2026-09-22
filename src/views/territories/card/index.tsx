import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryTemplateProps } from '../index.types';
import CardBack from '../shared/CardBack';
import CardFront from '../shared/CardFront';

const CUT = '0.5px dashed #BDBDBD';

// two halves of the sheet, cut along the middle; a couple of points are left
// over so a wrapped line can never push the card onto a second page
const SHEETS = {
  A4: { width: 575, half: 400, rows: 11 },
  LETTER: { width: 592, half: 384, rows: 10 },
};

const TemplateTerritoryCard = ({
  territories,
  lang,
  showMap = true,
  printedOn,
  size = 'A4',
}: TerritoryTemplateProps & { size?: keyof typeof SHEETS }) => {
  const sheet = SHEETS[size];

  return (
    <Document title="Territory card" lang={lang}>
      {territories.map((territory) => (
        <Page
          key={territory.id}
          size={size}
          style={{
            backgroundColor: '#FFFFFF',
            paddingLeft: 10,
            paddingTop: 10,
          }}
        >
          <View style={{ border: CUT }}>
            <CardFront
              territory={territory}
              width={sheet.width}
              height={sheet.half}
              showMap={showMap}
            />

            <CardBack
              territory={territory}
              width={sheet.width}
              height={sheet.half}
              rowsPerColumn={sheet.rows}
              notes={territory.notes}
              printedOn={printedOn}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TemplateTerritoryCard;
