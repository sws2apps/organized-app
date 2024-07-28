import { StyleSheet } from '@react-pdf/renderer';

const stylesCustom = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '20px',
    width: '90%',
    height: '90%',
    padding: '60px 42px',
  },
  content: {
    height: '325px',
    width: '244px',
    border: '1px dashed black',
    padding: '10px 12px',
  },
});

export default stylesCustom;
