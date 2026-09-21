import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryTemplateProps } from '../index.types';
import CardBack from '../shared/CardBack';
import CardFront from '../shared/CardFront';

const WIDTH = 575;
// two halves of an A4 sheet, cut along the middle; a couple of points are
// left over so a wrapped line can never push the card onto a second page
const FRONT_HEIGHT = 400;
const BACK_HEIGHT = 400;

const TemplateTerritoryCard = ({
  territories,
  lang,
  showMap = true,
  printedOn,
}: TerritoryTemplateProps) => (
  <Document title="Territory card" lang={lang}>
    {territories.map((territory) => (
      <Page
        key={territory.id}
        size="A4"
        style={{ backgroundColor: '#FFFFFF', paddingLeft: 10, paddingTop: 10 }}
      >
        <View>
          <CardFront
            territory={territory}
            width={WIDTH}
            height={FRONT_HEIGHT}
            showMap={showMap}
          />

          <CardBack
            territory={territory}
            width={WIDTH}
            height={BACK_HEIGHT}
            rowsPerColumn={11}
            notes={territory.notes}
            printedOn={printedOn}
          />
        </View>
      </Page>
    ))}
  </Document>
);

export default TemplateTerritoryCard;
