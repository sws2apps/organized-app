import { Fragment } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useCongregationRequests from '@features/ministry/preaching_partner/congregation_requests/useCongregationRequests';
import Card from '@components/card';
import ConfirmArrangement from '@features/ministry/preaching_partner/confirm_arrangement';
import Divider from '@components/divider';
import FilterChip from '@components/filter_chip';
import InfoNote from '@components/info_note';
import Markup from '@components/text_markup';
import PreachingPartnerGroup from '@features/ministry/preaching_partner/request_group';
import PreachingPartnerRow from '@features/ministry/preaching_partner/request_row';
import Typography from '@components/typography';

const CongregationRequests = () => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const {
    groups,
    openCount,
    filters,
    filterOptions,
    joinRequest,
    handleToggleFilter,
    handleClearFilters,
    handleJoin,
    handleCloseJoin,
  } = useCongregationRequests();

  return (
    <>
      <Card sx={{ gap: tablet688Up ? '24px' : '16px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="body-small-semibold" color="var(--grey-350)">
            {t('tr_filters')}
          </Typography>

          {/* a phone keeps the chips on one scrolling row instead of two */}
          <Box
            role="group"
            aria-label={t('tr_filters')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: tablet688Up ? 'wrap' : 'nowrap',
              gap: '8px',
              overflowX: tablet688Up ? 'visible' : 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              '& > *': { flexShrink: 0 },
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

        {groups.length === 0 && openCount === 0 && (
          <InfoNote message={t('tr_noCongregationPartnerRequests')} />
        )}

        {groups.length === 0 && openCount > 0 && (
          <InfoNote>
            <Markup
              content={t('tr_noPartnerRequestsMatch')}
              className="body-small-regular"
              color="var(--accent-400)"
              anchorClick={handleClearFilters}
            />
          </InfoNote>
        )}

        {groups.map((group, index) => (
          <Fragment key={group.date}>
            {index > 0 && <Divider color="var(--accent-200)" />}

            <PreachingPartnerGroup date={group.date}>
              {group.requests.map((request) => (
                <PreachingPartnerRow
                  key={request.request_uid}
                  request={request}
                  onJoin={handleJoin}
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
