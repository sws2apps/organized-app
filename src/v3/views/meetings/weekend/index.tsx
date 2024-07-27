import { useRecoilValue } from 'recoil';
import { Font, Document } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { WeekendMeetingTemplateType } from './index.types';
import { monthNamesState } from '@states/app';
import FontBold from '@assets/fonts/Inter-SemiBold.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import WeekendMeetingContainer from './WeekendMeetingContainer';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [{ src: FontRegular }, { src: FontBold }],
});

Font.registerHyphenationCallback((word) => [word]);

const WeekendMeetingTemplate = ({ data }: WeekendMeetingTemplateType) => {
  const { t } = useAppTranslation();

  const monthNames = useRecoilValue(monthNamesState);

  const generateDocumentTitle = () => {
    let title = t('weekendMeetingPrint');

    const firstWeek = data[0];
    const lastWeek = data.at(-1);

    const [yearStart, monthStart] = firstWeek.weekOf.split('/');
    const [yearLast, monthLast] = lastWeek.weekOf.split('/');

    const firstMonth = `${monthNames[+monthStart - 1]} ${yearStart}`;
    const lastMonth = `${monthNames[+monthLast - 1]} ${yearLast}`;

    title += `: ${firstMonth}`;

    if (firstMonth !== lastMonth) {
      title += ` - ${lastMonth}`;
    }

    return title;
  };

  return (
    <>
      {data.length > 0 && (
        <Document
          author="sws2apps"
          title={generateDocumentTitle()}
          creator="Organized"
          producer="sws2apps (by react-pdf)"
        >
          <WeekendMeetingContainer data={data} />
        </Document>
      )}
    </>
  );
};

export default WeekendMeetingTemplate;
