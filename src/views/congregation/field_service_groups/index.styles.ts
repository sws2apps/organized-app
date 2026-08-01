import { StyleSheet } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';

const styles = StyleSheet.create({
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
    gap: '5px',
  },
  dashedDivider: {
    stroke: '#DADADA',
    strokeWidth: 1,
    strokeDasharray: '5 4',
  },
  groupOverseerText: {
    fontWeight: 600,
    fontSize: '10px',
  },
  groupOverseerAssistantText: {
    fontWeight: 400,
    fontSize: '10px',
  },
  groupColumns: {
    display: 'flex',
    flexDirection: 'row',
    gap: '7px',
  },
  groupMemberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  groupMember: {
    fontWeight: 400,
    color: '#222222',
    fontSize: '10px',
  },
  groupsContainer: {
    position: 'relative',
    width: '100%',
  },
});

export default styles;
