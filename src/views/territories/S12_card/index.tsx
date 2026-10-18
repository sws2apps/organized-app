import { Page } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryTemplateProps } from '../index.types';
import CardBack from '../shared/CardBack';
import CardFront from '../shared/CardFront';

// the card at its own size, one page per side, for printing straight onto card stock
const WIDTH = 467;
const HEIGHT = 301;

const TemplateTerritoryS12Card = ({
  territories,
  lang,
  printedOn,
  parts,
}: TerritoryTemplateProps) => (
  <Document title="S-12" lang={lang}>
    {territories.map((territory) => [
      parts.front && (
        <Page
          key={`${territory.id}-front`}
          size={[WIDTH, HEIGHT]}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <CardFront territory={territory} width={WIDTH} height={HEIGHT} />
        </Page>
      ),
      parts.back && (
        <Page
          key={`${territory.id}-back`}
          size={[WIDTH, HEIGHT]}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <CardBack
            territory={territory}
            width={WIDTH}
            height={HEIGHT}
            rowsPerColumn={7}
            notes={territory.notes}
            printedOn={printedOn}
          />
        </Page>
      ),
    ])}
  </Document>
);

export default TemplateTerritoryS12Card;
