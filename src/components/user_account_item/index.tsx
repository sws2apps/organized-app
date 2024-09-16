import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { StyledBoxWrapper } from './index.styles';
import {
  UserAccountItemIconType,
  UserAccountItemProps,
  UserAccountItemTextContentType,
} from './index.types';
import {
  IconAccount,
  IconAdmin,
  IconArrowLink,
  IconAssignment,
} from '@components/icons';
import Typography from '@components/typography';

/**
 * Renders user account information based on the variant.
 * @param {Object} props - The props for the component.
 * @param {('user' | 'admin' | 'baptized')} props.variant - The variant of the user account item.
 * @param {string} props.userName - The name of the user.
 * @param {string} [props.secondary] - The position of the user (applicable for 'admin' variant).
 * @returns {JSX.Element} - JSX element representing the user account information.
 * @example
 * // Renders user name for a regular user:
 * <UserAccountItemTextContent variant="user" userName="John Doe" />
 *
 * // Renders user name and position for an admin user:
 * <UserAccountItemTextContent variant="admin" userName="Admin" secondary="Administrator" />
 *
 * // Renders user name for a baptized user:
 * <UserAccountItemTextContent variant="baptized" userName="Jane Doe" />
 */
const UserAccountItemTextContent = (props: UserAccountItemTextContentType) => {
  switch (props.variant) {
    case 'user':
    case 'baptized':
      return (
        <Typography
          className="h4"
          style={{ fontWeight: '550', color: props.color || 'var(--black)' }}
        >
          {props.name}
        </Typography>
      );

    case 'admin':
      return (
        <Box>
          <Typography
            className="h4"
            style={{
              fontWeight: '550',
              margin: '0',
              color: props.color || 'var(--black)',
            }}
          >
            {props.name}
          </Typography>
          <Typography
            className="body-small-regular"
            style={{
              color:
                props.color !== 'var(--black)'
                  ? 'var(--accent-400)'
                  : props.color,
            }}
          >
            {props.secondary}
          </Typography>
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
const UserAccountItemIcon = (props: UserAccountItemIconType) => {
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
 * <UserAccountItem variant="admin" userName="Admin" secondary="Administrator" />
 *
 * // Renders a user account item for a baptized user:
 * <UserAccountItem variant="baptized" userName="Jane Doe" />
 */
const UserAccountItem = (props: UserAccountItemProps) => {
  const variant = props.variant || 'user';
  const secondary = props.secondary || null;
  const name = props.name;
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
        <UserAccountItemIcon
          variant={variant}
          color={isHovered ? 'var(--accent-dark)' : 'var(--black)'}
        />
        <UserAccountItemTextContent
          variant={variant}
          name={name}
          secondary={secondary}
          color={isHovered ? 'var(--accent-dark)' : 'var(--black)'}
        />
      </Box>
      <IconButton
        sx={{ width: '32px', height: '32px' }}
        onClick={(e) => {
          clickOnArrow();
          e.stopPropagation();
        }}
      >
        <IconArrowLink
          color={isHovered ? 'var(--accent-dark)' : 'var(--black)'}
        />
      </IconButton>
    </StyledBoxWrapper>
  );
};

/**
 * Exports the UserAccountItem component as default.
 */
export default UserAccountItem;
