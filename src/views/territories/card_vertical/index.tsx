import { useAppTranslation } from '@hooks/index';
import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryTemplateProps } from '@views/territories/index.types';
import CardBack from '@views/territories/shared/CardBack';
import MapFront from '@views/territories/shared/MapFront';

// an A4 sheet on its side, two A5 halves: the map, and what goes with it
import {
  A5_VERTICAL,
  PRINT_MARGIN,
  printableA5,
} from '@views/territories/geometry';

const HALF = A5_VERTICAL.width;
const CONTENT = printableA5(A5_VERTICAL);

const TemplateTerritoryCardVertical = ({
  territories,
  lang,
  printedOn,
  parts,
}: TerritoryTemplateProps) => {
  const { t } = useAppTranslation();
  return (
    <Document title={t('tr_territoryTerritoryCard')} lang={lang}>
      {territories.map((territory) => (
        <Page
          key={territory.id}
          wrap={false}
          size="A4"
          orientation="landscape"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <View
            wrap={false}
            style={{
              position: 'relative',
              flexDirection: 'row',
              width: HALF * 2,
              height: A5_VERTICAL.height,
            }}
          >
            {parts.front ? (
              <View style={{ padding: PRINT_MARGIN, width: HALF }}>
                <MapFront
                  territory={territory}
                  width={CONTENT.width}
                  height={CONTENT.height}
                />
              </View>
            ) : (
              <View style={{ width: HALF }} />
            )}
            {parts.back && (
              <View style={{ padding: PRINT_MARGIN, width: HALF }}>
                <CardBack
                  territory={territory}
                  width={CONTENT.width}
                  height={CONTENT.height}
                  notes={territory.notes}
                  printedOn={printedOn}
                />
              </View>
            )}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TemplateTerritoryCardVertical;
