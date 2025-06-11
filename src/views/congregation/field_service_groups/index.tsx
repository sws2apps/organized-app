import { View } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsProps } from './index.types';
import registerFonts from '@views/registerFonts';
import FSGGroup from './FSGGroup';
import styles from './index.styles';
import { IconGroups } from '@views/components/icons';
import { Document, Page, PageContent, PageHeader } from '@views/components';

registerFonts();

const TemplateFieldServiceGroups = ({
  congregation,
  groups,
  lang,
}: TemplateFieldServiceGroupsProps) => {
  const { t } = useAppTranslation();

  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  return (
    <Document title={t('tr_fieldServiceGroups')}>
      <Page font={font}>
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
