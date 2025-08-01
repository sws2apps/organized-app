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
    fontWeight: 500,
    fontSize: '14px',
  },
  congregationNameContainer: {
    padding: '2px 8px 2px 8px',
    borderRadius: '2px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#D5DFFD',
  },
  congregationName: {
    fontSize: '10px',
    fontWeight: 500,
    color: '#3B4CA3',
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
    alignItems: 'center',
    gap: '4px',
  },
  groupTitle: {
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
    fontWeight: 600,
    fontSize: '8px',
  },
  groupListContainer: {
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    padding: '6px 8px 6px 8px',
    borderWidth: '0.5px',
    borderTop: '0px',
    borderColor: '#AAAAAA',
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
    borderBottom: `0.5px dashed #DADADA`,
  },
  groupOverseerText: {
    fontWeight: 600,
    fontSize: '10px',
  },
  groupOverseerAssistantText: {
    fontWeight: 400,
    fontSize: '10px',
  },
  groupMemberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  groupMember: {
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
