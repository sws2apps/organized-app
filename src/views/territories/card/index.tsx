import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryTemplateProps } from '../index.types';
import CardBack from '../shared/CardBack';
import CardFront from '../shared/CardFront';

const CUT = '0.5px dashed #BDBDBD';

const WIDTH = 575;
// two halves of an A4 sheet, cut along the middle; a couple of points are
// left over so a wrapped line can never push the card onto a second page
const HALF = 400;

const TemplateTerritoryCard = ({
  territories,
  lang,
  printedOn,
  parts,
}: TerritoryTemplateProps) => {
  return (
    <Document title="Territory card" lang={lang}>
      {territories.map((territory) => (
        <Page
          key={territory.id}
          size="A4"
          style={{
            backgroundColor: '#FFFFFF',
            paddingLeft: 10,
            paddingTop: 10,
          }}
        >
          <View style={{ border: CUT }}>
            {parts.front && (
              <CardFront territory={territory} width={WIDTH} height={HALF} />
            )}

            {parts.back && (
              <CardBack
                territory={territory}
                width={WIDTH}
                height={HALF}
                rowsPerColumn={11}
                notes={territory.notes}
                printedOn={printedOn}
              />
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TemplateTerritoryCard;
