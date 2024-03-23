import { Alert, AlertTitle, IconButton } from '@mui/material';
import { UserAccountItemProps } from './user_account_item.types';

import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined';

/**
 * Component: UserAccountItemTextContent
 *
 * UserAccountItemTextContent is a component that displays the text content of a user account item.
 * Depending on the variant passed as a prop, the component displays different text formats.
 *
 * Props:
 * - variant: 'user' | 'admin' | 'baptized':
 *   Determines the variant of text content display. Possible values:
 *     - 'user': Displays only the user's name in h4 format.
 *     - 'admin': Displays the user's name in AlertTitle format with bold styling, along with the user's position.
 *     - 'baptized': Same display format as 'user'. (Note: Currently, 'baptized' variant behaves the same as 'user'.)
 *
 * Usage Example:
 * ```
 * <UserAccountItemTextContent
 *   variant="admin"
 *   userName="John Doe"
 *   userPosition="App administrator"
 * />
 * ```
 */
const UserAccountItemTextContent = (props: {
  variant: 'user' | 'admin' | 'baptized';
  userName: string;
  userPosition: string;
}) => {
  switch (props.variant) {
    case 'user':
    case 'baptized':
      return (
        <div className="h4" style={{ fontWeight: '550' }}>
          {props.userName}
        </div>
      );

    case 'admin':
      return (
        <>
          <AlertTitle className="h4" style={{ fontWeight: '550', margin: '0' }}>
            {props.userName}
          </AlertTitle>
          <div className="body-small-regular">{props.userPosition}</div>
        </>
      );
  }
};

/**
 * Component: UserAccountItemIcon
 *
 * UserAccountItemIcon is a component that renders an icon based on the variant passed as a prop.
 *
 * Props:
 * - variant: 'user' | 'admin' | 'baptized':
 *   Determines the type of icon to render. Possible values:
 *     - 'user': Renders AssignmentIndOutlinedIcon.
 *     - 'admin': Renders AdminPanelSettingsOutlinedIcon.
 *     - 'baptized': Renders AccountCircleOutlinedIcon.
 *
 * Usage Example:
 * ```
 * <UserAccountItemIcon variant="admin" />
 * ```
 */
const UserAccountItemIcon = (props: { variant: 'user' | 'admin' | 'baptized' }) => {
  const iconHTMLColor = 'var(--black)';

  switch (props.variant) {
    case 'user':
      return <AssignmentIndOutlinedIcon htmlColor={iconHTMLColor} />;

    case 'admin':
      return <AdminPanelSettingsOutlinedIcon htmlColor={iconHTMLColor} />;

    case 'baptized':
      return <AccountCircleOutlinedIcon htmlColor={iconHTMLColor} />;
  }
};

/**
 * Component: UserAccountItem
 *
 * UserAccountItem is a component that represents a user account item.
 *
 * Props:
 * - variant: 'user' | 'admin' | 'baptized':
 *   Determines the variant of the user account item.
 *   Defaults to 'user'.
 *   - 'user': Regular user account.
 *   - 'admin': Administrator account.
 *   - 'baptized': Baptized user account.
 * - clickOnArrow?: () => void:
 *   Function to call when clicking on the arrow icon associated with the user account item.
 * - clickOnUserAccountItem?: () => void:
 *   Function to call when clicking on the user account item.
 * - userName: string:
 *   The name of the user.
 * - userPosition?: string:
 *   The position or role of the user (optional).
 *
 * Usage Example:
 * ```
 * <UserAccountItem
 *      userName="Jeremiah Green"
 *      variant="admin"
 *      userPosition="App administrator"
 *      clickOnUserAccountItem={() => {
 *         console.log('Click on user account item');
 *      }}
 *      clickOnArrow={() => {
 *         console.log('Click on arrow');
 *      }}
 * />
 * ```
 */
const UserAccountItem = (props: UserAccountItemProps) => {
  const variant = props.variant || 'user';
  const userPosition = props.userPosition || null;
  const userName = props.userName;
  const clickOnArrow = props.clickOnArrow || null;
  const clickOnUserAccountItem = props.clickOnUserAccountItem || null;

  return (
    <Alert
      icon={<UserAccountItemIcon variant={variant} />}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 'var(--radius-l)',
        border: '1px solid var(--accent-300)',
        backgroundColor: 'var(--white)',
        color: 'var(--black)',
        padding: 'none',
        cursor: 'pointer',
        'MuiPaper-root': {
          boxShadow: 'none',
        },
        // height: '48px',
        '&:hover': {
          backgroundColor: 'var(--accent-150)',
          borderColor: 'var(--accent-dark)',
          boxShadow: '0px 2px 8px 0px #1c1c1c1f',
          color: 'var(--accent-dark)',
          '.MuiSvgIcon-root': {
            color: 'var(--accent-dark) !important',
          },
        },
        '.MuiAlert-message': {
          padding: '0 !important',
        },
      }}
      action={
        <IconButton
          type="button"
          onClick={(e) => {
            clickOnArrow();
            e.stopPropagation();
          }}
        >
          <ArrowOutwardOutlinedIcon htmlColor="var(--black)" />
        </IconButton>
      }
      onClick={clickOnUserAccountItem}
    >
      <UserAccountItemTextContent variant={variant} userName={userName} userPosition={userPosition} />
    </Alert>
  );
};

/**
 * Exports the UserAccountItem component as default.
 */
export default UserAccountItem;
