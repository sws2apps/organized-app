import { Box, IconButton } from '@mui/material';
import { UserAccountItemProps } from './user_account_item.types';

import { StyledBoxWrapper } from './user_account_item.styled';
import { useState } from 'react';
import { IconAccount, IconAdmin, IconArrowLink, IconAssignment } from '@components/icons';

/**
 * Renders user account information based on the variant.
 * @param {Object} props - The props for the component.
 * @param {('user' | 'admin' | 'baptized')} props.variant - The variant of the user account item.
 * @param {string} props.userName - The name of the user.
 * @param {string} [props.userPosition] - The position of the user (applicable for 'admin' variant).
 * @returns {JSX.Element} - JSX element representing the user account information.
 * @example
 * // Renders user name for a regular user:
 * <UserAccountItemTextContent variant="user" userName="John Doe" />
 *
 * // Renders user name and position for an admin user:
 * <UserAccountItemTextContent variant="admin" userName="Admin" userPosition="Administrator" />
 *
 * // Renders user name for a baptized user:
 * <UserAccountItemTextContent variant="baptized" userName="Jane Doe" />
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
        <Box>
          <div className="h4" style={{ fontWeight: '550', margin: '0' }}>
            {props.userName}
          </div>
          <div className="body-small-regular">{props.userPosition}</div>
        </Box>
      );
  }
};

/**
 * Renders an icon representing the user account type based on the variant.
 *
 * @param {Object} props - The props for the component.
 * @param {('user' | 'admin' | 'baptized')} props.variant - The variant of the user account item.
 * @param {string} props.color - The color of the icon.
 *
 * @returns {JSX.Element} - JSX element representing the icon for the user account.
 *
 * @example
 * // Renders a user icon with blue color:
 * <UserAccountItemIcon variant="user" color="blue" />
 *
 * // Renders an admin icon with red color:
 * <UserAccountItemIcon variant="admin" color="red" />
 *
 * // Renders a baptized icon with green color:
 * <UserAccountItemIcon variant="baptized" color="green" />
 */
const UserAccountItemIcon = (props: { variant: 'user' | 'admin' | 'baptized'; color: string }) => {
  switch (props.variant) {
    case 'user':
      return <IconAssignment color={props.color} />;

    case 'admin':
      return <IconAdmin color={props.color} />;

    case 'baptized':
      return <IconAccount color={props.color} />;
  }
};

/**
 * Renders a user account item with an icon, user name, and optional user position.
 *
 * @param {UserAccountItemProps} props - The props for the component.
 *
 * @returns {JSX.Element} - JSX element representing the user account item.
 *
 * @example
 * // Renders a user account item for a regular user:
 * <UserAccountItem userName="John Doe" />
 *
 * // Renders a user account item for an administrator with a position:
 * <UserAccountItem variant="admin" userName="Admin" userPosition="Administrator" />
 *
 * // Renders a user account item for a baptized user:
 * <UserAccountItem variant="baptized" userName="Jane Doe" />
 */
const UserAccountItem = (props: UserAccountItemProps) => {
  const variant = props.variant || 'user';
  const userPosition = props.userPosition || null;
  const userName = props.userName;
  const clickOnArrow = props.clickOnArrow || null;
  const clickOnUserAccountItem = props.clickOnUserAccountItem || null;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <StyledBoxWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isHovered ? 'hover-shadow' : ''}
      onClick={clickOnUserAccountItem}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <UserAccountItemIcon variant={variant} color={isHovered ? 'var(--accent-dark)' : 'var(--black)'} />
        <UserAccountItemTextContent variant={variant} userName={userName} userPosition={userPosition} />
      </Box>
      <IconButton
        sx={{ width: '32px', height: '32px' }}
        onClick={(e) => {
          clickOnArrow();
          e.stopPropagation();
        }}
      >
        <IconArrowLink color={isHovered ? 'var(--accent-dark)' : 'var(--black)'} />
      </IconButton>
    </StyledBoxWrapper>
  );
};

/**
 * Exports the UserAccountItem component as default.
 */
export default UserAccountItem;
