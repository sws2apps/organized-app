export const getDutiesNavigationStyles = (
  tablet500Down: boolean,
  isNavigationWrapped: boolean
) => ({
  dateNavigator: {
    width: tablet500Down || isNavigationWrapped ? '100%' : 'fit-content',
    alignSelf: 'flex-start',
    minWidth: 0,
    maxWidth: '100%',
  },
  dateContainer: {
    minWidth: 0,
    maxWidth: '100%',
    flex: tablet500Down ? '1 1 auto' : '999 1 auto',
  },
  tabs: {
    display: tablet500Down ? 'flex' : 'inline-grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(0, 1fr)',
    width: tablet500Down ? '100%' : 'max-content',
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 0,
    maxWidth: '100%',
  },
});
