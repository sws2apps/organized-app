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
    fontWeight: 'bold',
    marginBottom: '8px',
    lineHeight: 1.2,
    textAlign: 'center',
    fontSize: '12px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  detailsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '5px',
    alignItems: 'flex-end',
  },
  field: {
    fontWeight: 'bold',
    fontSize: '12px',
  },
  fieldValue: {
    flex: '1 0 0',
  },
  fieldValueText: {
    marginBottom: '3px',
    paddingBottom: '1px',
    borderBottom: '1px dotted black',
    fontSize: '9px',
  },
  toBeGiven: {
    marginTop: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
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
    fontSize: '9px',
    marginTop: '12px',
    lineHeight: 1.1,
  },
  footer: {
    fontSize: '8px',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
  },
});

export default styles;
