import { StyleSheet } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';

const styles = StyleSheet.create({
  page: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
  },

  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  documentNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '5px',
    alignItems: 'center',
  },

  documentNameTypography: {
    color: '#000000',
    fontWeight: 500,
    fontSize: '14px',
  },

  congregationNameContainer: {
    padding: '2px 8px 2px 8px',
    borderRadius: '2px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#6876BE',
  },

  congregationName: {
    fontSize: '10px',
    fontWeight: 500,
    color: '#FFFFFF',
  },

  upcomingEventsListContainer: {
    gap: '16px',
    display: 'flex',
    flexDirection: 'column',
  },

  yearlyUpcomingEventsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  yearContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 8px 5px 8px',
    borderRadius: '4px',
    border: `1px solid #D5DFFD`,
    backgroundColor: '#F2F5FF',
  },

  yearTypography: {
    color: '#5065D0',
    fontSize: '12px',
  },

  dateWithUpcomingEventsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: '4px',
    border: `1px solid #D5DFFD`,
    padding: '8px',
    backgroundColor: '#FFFFFF',
  },

  dateTypography: {
    fontWeight: '500',
    fontSize: '11px',
    color: '#222222',
  },

  upcomingEventContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
  },

  upcomingEventTimeContainer: {
    backgroundColor: '#F2F5FF',
    borderRadius: getCSSPropertyValue('--radius-s'),
    padding: '4px 12px 4px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  upcomingEventTimeTypography: {
    fontWeight: '600',
    fontSize: '10px',
    color: '#3B4CA3',
  },

  upcomingEventTitleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  upcomingEventTitleTypography: {
    color: '#222222',
    fontWeight: '500',
    fontSize: '11px',
  },

  upcomingEventAdditionalTypography: {
    color: '#505050',
    fontWeight: '400px',
    fontSize: '10px',
  },
});

export default styles;
