import { useTranslation } from 'react-i18next';
import { Font, Document } from '@react-pdf/renderer';
import RobotoBold from '../fonts/Roboto-Bold.ttf';
import RobotoRegular from '../fonts/Roboto-Regular.ttf';
import { WeekendMeetingContainer } from './weekendMeeting';
import { Setting } from '../classes/Setting';

Font.register({
  family: 'Roboto',
  format: 'truetype',
  fonts: [{ src: RobotoRegular }, { src: RobotoBold }],
});

Font.registerHyphenationCallback((word) => [word]);

const WeekendMeetingTemplate = ({ data }) => {
  const { t } = useTranslation('source');

  const generateDocumentTitle = () => {
    let title = t('weekendMeetingPrint');

    const firstWeek = data[0];
    const lastWeek = data.at(-1);

    const firstSplit = firstWeek.weekend_meeting_date.split('/');
    const lastSplit = lastWeek.weekend_meeting_date.split('/');

    const firstMonth = `${Setting.monthNames()[+firstSplit[1] - 1]} ${firstSplit[0]}`;
    const lastMonth = `${Setting.monthNames()[+lastSplit[1] - 1]} ${firstSplit[0]}`;

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
          creator="Congregation Program for Everyone (CPE)"
          producer="sws2apps (by react-pdf)"
        >
          <WeekendMeetingContainer data={data} />
        </Document>
      )}
    </>
  );
};

export default WeekendMeetingTemplate;
