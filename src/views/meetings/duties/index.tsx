import { View } from '@react-pdf/renderer';
import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconDuties } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';
import { TemplateMeetingDutiesProps } from './index.types';
import packDuties, { CARD_GAP, cardWidth, pageBox } from './packDuties';
import styles from './index.styles';
import DutiesCard from './DutiesCard';

const TemplateMeetingDuties = ({
  congregation,
  duties,
  lang,
  orientation = 'portrait',
  fontSize = 10,
}: TemplateMeetingDutiesProps) => {
  const { t } = useAppTranslation();

  const pages = packDuties(duties, fontSize, orientation);

  const contentHeight = pageBox(orientation).height;

  return (
    <Document title={t('tr_meetingDutiesSchedules')} lang={lang}>
      {pages.map((placements) => (
        <Page key={placements[0].card.id} orientation={orientation}>
          <PageContent gap={CARD_GAP}>
            <PageHeader
              congregationName={congregation}
              variant="secondary"
              icon={<IconDuties size={18} />}
              title={t('tr_meetingDutiesSchedules')}
              fixed
            />

            <View
              style={{ ...styles.cardsArea, height: contentHeight }}
              wrap={false}
            >
              {placements.map(({ card, left, top }) => (
                <View key={card.id} style={{ position: 'absolute', left, top }}>
                  <DutiesCard
                    card={card}
                    width={cardWidth(orientation, card.span)}
                    fontSize={fontSize}
                  />
                </View>
              ))}
            </View>
          </PageContent>
        </Page>
      ))}
    </Document>
  );
};

export default TemplateMeetingDuties;
