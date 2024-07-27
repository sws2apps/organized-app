import Typography from '@components/typography';
import { Collapse, IconButton, Box } from '@mui/material';
import { CardHeaderPropsType } from './index.types';
import { StyledContentBox } from './index.styles';
import { IconExpand } from '@components/icons';
import { useState } from 'react';

/**
 * Component for rendering a card header.
 * @param {CardHeaderPropsType} props - Props for the CardHeader component.
 * @returns {JSX.Element} CardHeader component.
 */
const CardHeader = ({
  header,
  size = 'small',
  className,
  color = 'accent',
  children,
}: CardHeaderPropsType) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box sx={{ padding: 0 }}>
      <StyledContentBox color={color} size={size}>
        <Typography
          className={className}
          color={size === 'small' ? 'var(--accent-dark)' : `var(--white)`}
          sx={{ textAlign: 'left' }}
        >
          {header}
        </Typography>
        {children && (
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <IconExpand
              color="var(--accent-dark)"
              sx={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        )}
      </StyledContentBox>
      {children && <Collapse in={isExpanded}>{children}</Collapse>}
    </Box>
  );
};
export default CardHeader;
