import { View } from '@react-pdf/renderer';
import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconGroups } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsProps } from './index.types';
import packGroups, { pageBox } from './packGroups';
import styles from './index.styles';
import FSGGroup from './FSGGroup';

const TemplateFieldServiceGroups = ({
  congregation,
  groups,
  lang,
  orientation = 'portrait',
  fontSize = 10,
}: TemplateFieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  const pages = packGroups(groups, fontSize, orientation);

  const contentHeight = pageBox(orientation).height;

  return (
    <Document title={t('tr_fieldServiceGroups')} lang={lang}>
      {pages.map((placements) => (
        <Page key={placements[0].card.id} orientation={orientation}>
          <PageContent gap={10}>
            <PageHeader
              congregationName={congregation}
              variant="secondary"
              icon={<IconGroups size={18} />}
              title={t('tr_fieldServiceGroups')}
              fixed
            />
            <View
              style={{ ...styles.groupsContainer, height: contentHeight }}
              wrap={false}
            >
              {placements.map(({ card, left, top }) => (
                <View key={card.id} style={{ position: 'absolute', left, top }}>
                  <FSGGroup card={card} fontSize={fontSize} />
                </View>
              ))}
            </View>
          </PageContent>
        </Page>
      ))}
    </Document>
  );
};

export default TemplateFieldServiceGroups;
