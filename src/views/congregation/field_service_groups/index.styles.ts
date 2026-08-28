import { StyleSheet } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';

const styles = StyleSheet.create({
  groupTitleContainer: {
    width: '100%',
    overflow: 'hidden',
    padding: '4px 4px 4px 8px',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    // the count stays in the top right corner, whatever the title wraps to
    alignItems: 'flex-start',
    gap: '4px',
  },
  groupTitle: {
    fontWeight: 500,
    fontSize: '10px',
    color: '#FEFEFE',
    // a long group name has to wrap inside the space the badge leaves it,
    // instead of running underneath it
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  membersCountContainer: {
    backgroundColor: '#FEFEFE',
    borderRadius: getCSSPropertyValue('--radius-xs'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    gap: '7px',
  },
});

export default styles;
