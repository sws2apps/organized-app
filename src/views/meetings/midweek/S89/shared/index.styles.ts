import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
    padding: '10px 12px',
    fontSize: '10px',
    color: 'black',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  header: {
    fontWeight: 800,
    marginBottom: '8px',
    lineHeight: 1.1,
    textAlign: 'center',
    fontSize: '11.5px',
    letterSpacing: -0.28,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    alignItems: 'flex-end',
  },
  field: {
    fontWeight: 800,
    fontSize: '11px',
    paddingBottom: '2px',
  },
  fieldValue: {
    flex: '1 0 0',
  },
  fieldValueText: {
    paddingBottom: '1px',
    paddingLeft: '5px',
    borderBottom: '1px dashed black',
    fontSize: '11px',
  },
  toBeGiven: {
    marginTop: '16px',
    fontSize: '12px',
    fontWeight: 800,
  },
  classes: {
    marginTop: '2px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  classItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    alignItems: 'center',
    marginLeft: '10px',
  },
  classLabel: {
    fontSize: '10px',
    fontWeight: 'normal',
  },
  studentNote: {
    fontSize: '8.5px',
    marginTop: '16px',
    lineHeight: 1.1,
    letterSpacing: -0.4,
    textAlign: 'justify',
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: 'auto',
  },
  footer: {
    fontSize: '7px',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    fontWeight: 300,
  },
});

export default styles;
