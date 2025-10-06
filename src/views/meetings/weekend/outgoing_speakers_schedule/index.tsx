import { Document, Page, PageContent, PageHeader } from '@views/components';
import { TemplateOutgoingSpeakersProps } from './index.types';
import useAppTranslation from '@hooks/useAppTranslation';
import { getCSSPropertyValue } from '@utils/common';
import IconOutgoinпSpeakers from '@views/components/icons/IconOutgoingSpeakers';
import OSScheduleContainer from './OSScheduleContainer';

const TemplateOutgoingSpeakersSchedule = ({
  congregation,
  lang,
  data,
}: TemplateOutgoingSpeakersProps) => {
  const { t } = useAppTranslation();

  return (
    <Document title={t('tr_outgoingSpeakersSchedule')}>
      <Page lang={lang}>
        <PageContent gap={0}>
          <PageHeader
            fixed
            variant={'main'}
            title={t('tr_outgoingSpeakersSchedule')}
            backgroundColor={getCSSPropertyValue('--pdf-green-main')}
            congregationName={congregation}
            icon={<IconOutgoinпSpeakers size={18} />}
          />

          <OSScheduleContainer data={data} />
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateOutgoingSpeakersSchedule;
