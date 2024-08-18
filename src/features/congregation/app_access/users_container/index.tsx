import { Box } from '@mui/material';
import { UsersContainerProps } from './index.types';
import Typography from '@components/typography';

/**
 * UsersContainer component
 *
 * This component is a container for displaying user-related content. It accepts a title, description, and optional children elements.
 *
 * @component
 * @example
 * <UsersContainer
 *   title="User List"
 *   description="List of all registered users"
 * >
 *   <UserList />
 * </UsersContainer>
 *
 * @param {UsersContainerProps} props - The properties passed to the component.
 * @returns {JSX.Element} The rendered UsersContainer component.
 */
const UsersContainer = ({
  description,
  title,
  children,
  ...props
}: UsersContainerProps) => {
  const gap = props.gap || '16px';

  return (
    <Box
      sx={{
        width: '100%',
        padding: '16px',
        borderRadius: 'var(--radius-xl)',
        gap: gap,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{title}</Typography>
        <Typography color={'var(--grey-400)'}>{description}</Typography>
      </Box>

      {children}
    </Box>
  );
};

export default UsersContainer;
