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
    backgroundColor: getCSSPropertyValue('--pdf-blue-main'),
  },

  congregationName: {
    fontSize: '10px',
    fontWeight: 500,
    color: '#FFFFFF',
  },
});

export default styles;
