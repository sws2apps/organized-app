import { Document, Page, PageContent, PageHeader } from '@views/components';
import { IconService } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';
import { FieldServiceMeetingTemplateProps } from './index.types';
import FieldServiceMonth from './FieldServiceMonth';

const TemplateFieldServiceMeetings = ({
  groupLabel,
  lang,
  months,
}: FieldServiceMeetingTemplateProps) => {
  const { t } = useAppTranslation();

  return (
    <Document title={t('tr_fieldServiceMeetings', { lng: lang })} lang={lang}>
      <Page>
        <PageContent gap={15}>
          <PageHeader
            variant="secondary"
            title={t('tr_fieldServiceMeetings', { lng: lang })}
            icon={<IconService size={18} />}
            congregationName={groupLabel}
          />

          {months.map((month) => (
            <FieldServiceMonth key={month.id} lang={lang} month={month} />
          ))}
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateFieldServiceMeetings;
