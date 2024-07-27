import { Box } from '@mui/material';
import { MonthItemProps } from './month_item.types';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import CustomBadge from '@components/badge';
import { IconCheck, IconReportNotSent } from '@components/icons';

const MonthItem = (props: MonthItemProps) => {
  const style = props.style || 'publisher';

  const { t } = useAppTranslation();

  switch (style) {
    case 'pioneer':
      return (
        <Box
          sx={{
            padding: '4px, 8px, 4px, 8px',
            gap: '16px',
            display: 'flex',
            borderRadius: 'var(--radius-m)',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            <CustomTypography className="h4" color={'var(--black)'}>
              {props.title}
            </CustomTypography>
            {props.comment ? (
              <CustomTypography
                className="body-small-regular"
                color={'var(--grey-350)'}
              >
                {props.comment}
              </CustomTypography>
            ) : null}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {props.bibleStudies ? (
              <CustomBadge
                sx={{
                  borderRadius: 'var(--radius-s)',
                }}
                text={t('tr_bibleStudiesCount', {
                  StudiesCount: props.bibleStudies,
                })}
                size={'big'}
                color={'grey'}
              />
            ) : null}

            {props.hours ? (
              <CustomBadge
                sx={{
                  borderRadius: 'var(--radius-s)',
                }}
                text={t('tr_hoursList', { Hours: props.hours })}
                size={'big'}
                color={'grey'}
              />
            ) : null}
          </Box>
        </Box>
      );
    case 'publisher':
      return (
        <Box
          sx={{
            padding: '2px, 8px, 2px, 8px',
            gap: '16px',
            display: 'flex',
            borderRadius: 'var(--radius-m)',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                {props.ministry ? (
                  <IconCheck color="var(--accent-main)" />
                ) : (
                  <IconReportNotSent color="var(--red-main)" />
                )}
              </Box>
              <CustomTypography className="h4" color={'var(--black)'}>
                {props.title}
              </CustomTypography>

              {props.auxiliaryPioneer ? (
                <CustomBadge
                  sx={{
                    borderRadius: 'var(--radius-s)',
                  }}
                  text={t('tr_auxiliaryPioneer')}
                  size={'big'}
                  color={'orange'}
                />
              ) : null}
            </Box>
            {props.comment ? (
              <CustomTypography
                className="body-small-regular"
                color={'var(--grey-350)'}
              >
                {props.comment}
              </CustomTypography>
            ) : null}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {props.bibleStudies ? (
              <CustomBadge
                sx={{
                  borderRadius: 'var(--radius-s)',
                }}
                text={t('tr_bibleStudiesCount', {
                  StudiesCount: props.bibleStudies,
                })}
                size={'big'}
                color={'grey'}
              />
            ) : null}

            {props.hours ? (
              <CustomBadge
                sx={{
                  borderRadius: 'var(--radius-s)',
                }}
                text={t('tr_hoursList', { Hours: props.hours })}
                size={'big'}
                color={'grey'}
              />
            ) : null}

            {props.inProgress ? (
              <CustomBadge
                sx={{
                  borderRadius: 'var(--radius-s)',
                }}
                text={`${props.hours} ${t('tr_inProgress')}`}
                size={'big'}
                color={'grey'}
              />
            ) : null}
          </Box>
        </Box>
      );
  }
};

export default MonthItem;
