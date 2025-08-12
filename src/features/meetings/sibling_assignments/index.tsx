import { Box, Collapse } from '@mui/material';
import {
  IconCongregation,
  IconExpand,
  IconLanguageGroup,
} from '@components/icons';
import { SiblingAssignmentProps } from './index.types';
import useSiblingItem from './useSiblingItem';
import Typography from '@components/typography';

const SiblingAssignment = ({
  children,
  type,
  label,
}: SiblingAssignmentProps) => {
  const { expanded, handleToggle } = useSiblingItem();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--grey-350)',
          borderRadius: 'var(--radius-s)',
          padding: '4px 8px',
          cursor: 'pointer',
        }}
        onClick={handleToggle}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1,
          }}
        >
          {type === 'main' ? (
            <IconCongregation color="var(--always-white)" />
          ) : (
            <IconLanguageGroup color="var(--always-white)" />
          )}
          <Typography
            className="h2-caps"
            color="var(--always-white)"
            align="center"
          >
            {label}
          </Typography>
        </Box>
        <IconExpand
          color="var(--always-white)"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        />
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </>
  );
};

export default SiblingAssignment;
