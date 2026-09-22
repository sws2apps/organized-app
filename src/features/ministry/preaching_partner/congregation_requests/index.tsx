import { Fragment } from 'react';
import { Box } from '@mui/material';
import { IconRaiseHand } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useCongregationRequests from './useCongregationRequests';
import Card from '@components/card';
import ConfirmArrangement from '../confirm_arrangement';
import Divider from '@components/divider';
import FilterChip from '@components/filter_chip';
import InfoNote from '@components/info_note';
import PreachingPartnerGroup from '../request_group';
import PreachingPartnerRow from '../request_row';
import Typography from '@components/typography';

const CongregationRequests = () => {
  const { t } = useAppTranslation();

  const {
    groups,
    filters,
    filterOptions,
    joinRequest,
    handleToggleFilter,
    handleJoin,
    handleCloseJoin,
  } = useCongregationRequests();

  return (
    <>
      <Card sx={{ gap: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="body-small-semibold" color="var(--grey-350)">
            {t('tr_filters')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {filterOptions.map((option) => (
              <FilterChip
                key={option.key}
                label={option.label}
                selected={filters.includes(option.key)}
                onClick={() => handleToggleFilter(option.key)}
              />
            ))}
          </Box>
        </Box>

        {groups.length === 0 && (
          <InfoNote message={t('tr_noCongregationPartnerRequests')} />
        )}

        {groups.map((group, index) => (
          <Fragment key={group.date}>
            {index > 0 && <Divider color="var(--accent-200)" />}

            <PreachingPartnerGroup date={group.date}>
              {group.requests.map((request) => (
                <PreachingPartnerRow
                  key={request.request_uid}
                  request={request}
                  variant="orange"
                  actionLabel={t('tr_join')}
                  actionIcon={<IconRaiseHand />}
                  onAction={() => handleJoin(request)}
                />
              ))}
            </PreachingPartnerGroup>
          </Fragment>
        ))}
      </Card>

      {joinRequest && (
        <ConfirmArrangement
          open={!!joinRequest}
          onClose={handleCloseJoin}
          request={joinRequest}
        />
      )}
    </>
  );
};

export default CongregationRequests;
