import { Box } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';
import { IconDragHandle, IconMyGroup } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { MEMBERS_SORTABLE_GROUP } from '../constants';
import useUnassignedPublishers from './useUnassignedPublishers';
import Typography from '@components/typography';

const UnassignedPublishers = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { publishers } = useUnassignedPublishers();

  if (!isServiceCommittee || publishers.length === 0) return null;

  return (
    <Box
      sx={{
        padding: '8px',
        gap: '8px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--accent-150)',
        borderRadius: 'var(--radius-xl)',
        border: '1px dashed var(--accent-350)',
      }}
    >
      <Box
        sx={{
          padding: '8px 16px',
          borderRadius: '6px',
          backgroundColor: 'var(--accent-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography className="h3" color="var(--accent-400)">
          {t('tr_publishersWithoutGroup')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <IconMyGroup color="var(--accent-400)" width={16} height={16} />

          <Typography className="body-small-semibold" color="var(--accent-400)">
            {publishers.length}
          </Typography>
        </Box>
      </Box>

      <ReactSortable
        list={publishers}
        setList={() => {}}
        group={{ name: MEMBERS_SORTABLE_GROUP, pull: true, put: false }}
        sort={false}
        animation={150}
        style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
      >
        {publishers.map((publisher) => (
          <Box
            key={publisher.person_uid}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-s)',
              cursor: 'grab',
              '&:hover': { backgroundColor: 'var(--accent-200)' },
            }}
          >
            <IconDragHandle color="var(--accent-350)" width={20} height={20} />

            <Typography>{publisher.name}</Typography>
          </Box>
        ))}
      </ReactSortable>
    </Box>
  );
};

export default UnassignedPublishers;
