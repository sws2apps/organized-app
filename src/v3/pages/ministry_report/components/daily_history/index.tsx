import { Box, Divider } from '@mui/material';
import { DailyHistoryProps } from './daily_history.types';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import CustomButton from '@components/button';
import { IconAdd, IconEdit, IconInfo } from '@components/icons';
import { FormatStringForDailyHistory } from '@pages/ministry_report/utils';
import CustomBadge from '@components/badge';
import { convertDurationInSecondsToString } from '@features/ministry/utils';

/**
 * DailyHistory component displays a list of daily ministry records.
 * It allows users to view, add, and edit daily records.
 * @param props DailyHistoryProps containing the configuration and data for the component.
 */
const DailyHistory = (props: DailyHistoryProps) => {
  const { t } = useAppTranslation();

  /**
   * Renders the content for each daily ministry record.
   * @returns JSX.Element representing the content for each daily ministry record.
   */
  const Content = () => {
    return props.records.map((value, index) => {
      const key = `daily_history_item-${index}`;

      return (
        <Box
          key={key}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              padding: '4px 8px 4px 8px',
              borderRadius: 'var(--radius-m)',

              '&:hover': {
                backgroundColor: 'var(--accent-150)',

                '.MuiBox-root > .MuiBox-root': {
                  backgroundColor: 'var(--accent-200)',
                },

                '.MuiTypography-root': {
                  color: 'var(--accent-dark)',
                },

                '.MuiBox-root > .MuiSvgIcon-root': {
                  display: 'block',
                },
              },
            }}
            onClick={() => props.onEditButtonClick(value, index)}
          >
            <CustomTypography
              className="h4"
              sx={{
                height: '24px',
              }}
            >
              {FormatStringForDailyHistory(value.date_of_creation)}
            </CustomTypography>
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <IconEdit
                sx={{
                  display: 'none',
                }}
                color="var(--accent-dark)"
              />
              {value.count_of_bible_studies != 0 ? (
                <CustomBadge
                  sx={{
                    borderRadius: 'var(--radius-s)',
                  }}
                  text={t('tr_bibleStudiesCount', { StudiesCount: value.count_of_bible_studies })}
                  size={'big'}
                  color={'grey'}
                />
              ) : null}
              {value.hours_in_seconds > 60 ? (
                <CustomBadge
                  sx={{
                    borderRadius: 'var(--radius-s)',
                  }}
                  text={t('tr_hoursList', { Hours: convertDurationInSecondsToString(value.hours_in_seconds) })}
                  size={'big'}
                  color={'grey'}
                />
              ) : null}
            </Box>
          </Box>
          <Divider
            sx={{
              border: '1px solid var(--accent-200)',
            }}
          />
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        gap: '8px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CustomTypography className="h2" color={'var(--black)'}>
          {t('tr_dailyHistory')}
        </CustomTypography>
        <CustomButton variant="secondary" startIcon={<IconAdd />} onClick={props.onAddButtonClick}>
          {t('tr_btnAddRecord')}
        </CustomButton>
      </Box>

      {props.records.length == 0 ? (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
          }}
        >
          <IconInfo color="var(--grey-350)" />
          <CustomTypography color="var(--grey-350)" className="body-regular">
            {t('tr_noDailyRecordsDesc')}
          </CustomTypography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '8px',
          }}
        >
          <Content />
        </Box>
      )}
    </Box>
  );
};

export default DailyHistory;
