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
    gap: '10px',
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
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '14px',
  },
  congregationNameContainer: {
    padding: '2px 8px 2px 8px',
    borderRadius: '2px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: getCSSPropertyValue('--accent-200'),
  },
  congragationName: {
    fontSize: '12px',
    fontWeight: 500,
    color: getCSSPropertyValue('--accent-dark'),
  },
  groupContainer: {
    width: '180px',
  },
  groupTitleContainer: {
    width: '100%',
    padding: '4px 4px 4px 8px',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
  groupTitle: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '10px',
    color: '#FEFEFE',
  },
  membersCountContainer: {
    backgroundColor: '#FEFEFE',
    borderRadius: getCSSPropertyValue('--radius-xs'),
    padding: '2px 4px 2px 4px',
    display: 'flex',
    gap: '8px',
  },
  membersCount: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '8px',
  },
  groupListContainer: {
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    padding: '6px 8px 6px 8px',
    borderWidth: '0.5px',
    borderTop: 'none',
    borderColor: getCSSPropertyValue('--grey-300'),
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  groupOverseers: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  dashedDivider: {
    width: '100%',
    border: 'none',
    borderBottom: `0.5px dashed ${getCSSPropertyValue('--grey-200')}`,
  },
  groupOverseerText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '10px',
  },
  groupOverseerAssistentText: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '10px',
  },
  groupMemberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  groupMember: {
    fontFamily: 'Inter',
    fontWeight: 400,
    color: '#222222',
    fontSize: '10px',
  },
  groupsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '7px',
  },
});

export default styles;
