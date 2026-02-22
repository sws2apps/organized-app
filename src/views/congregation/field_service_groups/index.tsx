import { View } from '@react-pdf/renderer';
import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconGroups } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsProps } from './index.types';
import styles from './index.styles';
import FSGGroup from './FSGGroup';

const TemplateFieldServiceGroups = ({
  congregation,
  groups,
  lang,
}: TemplateFieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  return (
    <Document title={t('tr_fieldServiceGroups')} lang={lang}>
      <Page>
        <PageContent gap={10}>
          <PageHeader
            congregationName={congregation}
            variant="secondary"
            icon={<IconGroups size={18} />}
            title={t('tr_fieldServiceGroups')}
            fixed
          />
          <View style={styles.groupsContainer}>
            {groups.map((group) => (
              <FSGGroup key={group.group_name} group={group} />
            ))}
          </View>
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateFieldServiceGroups;
