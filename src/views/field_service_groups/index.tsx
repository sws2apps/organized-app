import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsType } from './index.types';
import registerFonts from '@views/registerFonts';
import Document from '@views/components/document';
import Page from '@views/components/page';
import { View } from '@react-pdf/renderer';
import styles from './index.styles';
import PageHeader from '@views/components/page_header';
import FSGGroup from './FSGGroup';
import { IconGroups } from '@views/components/icons';
registerFonts();

const TemplateFieldServiceGroups = ({
  congregation,
  groups,
  lang,
}: TemplateFieldServiceGroupsType) => {
  const { t } = useAppTranslation();

  return (
    <Document title={t('tr_fieldServiceGroups')}>
      <Page lang={lang}>
        <View style={styles.contentContainer}>
          <PageHeader
            title={t('tr_fieldServiceGroups')}
            name={congregation}
            paintNameOnly
            backgroundColor="#D5DFFD"
            icon={<IconGroups size={18} />}
          />
          <View style={styles.groupsContainer}>
            {groups.map((group) => (
              <FSGGroup key={group.group_name} group={group} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateFieldServiceGroups;
