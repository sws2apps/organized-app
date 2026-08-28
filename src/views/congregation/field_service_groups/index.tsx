import { View } from '@react-pdf/renderer';
import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconGroups } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsProps } from './index.types';
import packGroups from './packGroups';
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

  const cards = packGroups(groups, fontSize, orientation);

  return (
    <Document title={t('tr_fieldServiceGroups')} lang={lang}>
      <Page orientation={orientation}>
        <PageContent gap={10}>
          <PageHeader
            congregationName={congregation}
            variant="secondary"
            icon={<IconGroups size={18} />}
            title={t('tr_fieldServiceGroups')}
            fixed
          />
          {/* the cards flow: each one keeps the height its own text needs, and
              the renderer moves a card that no longer fits to the next page */}
          <View style={styles.groupsContainer}>
            {cards.map((card) => (
              <FSGGroup key={card.id} card={card} fontSize={fontSize} />
            ))}
          </View>
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateFieldServiceGroups;
