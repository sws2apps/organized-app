import { useAppTranslation } from '@hooks/index';
import { Page, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { TerritoryTemplateProps } from '@views/territories/index.types';
import CardBack from '@views/territories/shared/CardBack';
import CardFront from '@views/territories/shared/CardFront';

import PrintGuides from '@views/territories/shared/PrintGuides';
import { A4, S12 } from '@views/territories/geometry';

// where Figma places the cut areas, front above back
const WIDTH = S12.width;
const HEIGHT = S12.height;
const LEFT = (A4.width - WIDTH) / 2;
const TOP = (A4.height - HEIGHT * 2) / 2;

const TemplateTerritoryS12 = ({
  territories,
  lang,
  printedOn,
  parts,
}: TerritoryTemplateProps) => {
  const { t } = useAppTranslation();
  return (
    <Document title={t('tr_territoryS122')} lang={lang}>
      {territories.map((territory) => (
        <Page
          key={territory.id}
          size="A4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <View
            wrap={false}
            style={{
              marginTop: TOP,
              marginLeft: LEFT,
              width: WIDTH,
              position: 'relative',
            }}
          >
            {parts.front && (
              <CardFront
                territory={territory}
                width={WIDTH}
                height={HEIGHT}
                printedOn={printedOn}
              />
            )}

            {parts.back && (
              <CardBack
                territory={territory}
                width={WIDTH}
                height={HEIGHT}
                notes={territory.notes}
                printedOn={printedOn}
              />
            )}
            <PrintGuides
              width={WIDTH}
              height={HEIGHT * (Number(parts.front) + Number(parts.back))}
              horizontal={parts.front && parts.back ? HEIGHT : undefined}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TemplateTerritoryS12;
