import PageTitle from '@components/page_title';
import useAppTranslation from '@hooks/useAppTranslation';
import useBreakpoints from '@hooks/useBreakpoints';
import { Box } from '@mui/material';
import {
  StyledCardContainer,
  StyledInfoCard,
  StyledKeyValueBox,
} from './service_year.styled';
import ScrollableTabs from '@components/scrollable_tabs';
import CustomTypography from '@components/typography';
import CustomDivider from '@components/divider';
import MonthItem from './components/month_item';
import { useState } from 'react';

const ServiceYear = () => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const isPioneer = true;

  const generateYearsTabsList = () => {
    const years = [];
    const currentYear = new Date().getFullYear();

    for (let i = -2; i <= 2; i++) {
      years.push({
        label: currentYear + i,
        Component: <></>,
      });
    }

    return years;
  };

  const [yearsTabs, setYearsTabs] = useState(() => {
    return generateYearsTabsList();
  });

  return (
    <>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle title={t('tr_serviceYear')} />
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexWrap: desktopUp ? 'nowrap' : 'wrap',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
              flexGrow: 1,
            }}
          >
            <StyledInfoCard>
              <ScrollableTabs tabs={yearsTabs} value={2} />
              <CustomDivider color="var(--accent-200)" />
              <StyledCardContainer>
                <StyledKeyValueBox>
                  <CustomTypography className="h3" color={'var(--black)'}>
                    {t('tr_totalHours')}
                  </CustomTypography>

                  <CustomTypography className="h3" color={'var(--black)'}>
                    95
                  </CustomTypography>
                </StyledKeyValueBox>
                <CustomDivider color="var(--accent-200)" dashed />
                <StyledKeyValueBox>
                  <CustomTypography
                    className="body-regular"
                    color={'var(--grey-350)'}
                  >
                    {t('tr_fieldMinistry')}
                  </CustomTypography>

                  <CustomTypography className="h4" color={'var(--grey-350)'}>
                    95
                  </CustomTypography>
                </StyledKeyValueBox>
                <CustomDivider color="var(--accent-200)" dashed />
                <StyledKeyValueBox>
                  <CustomTypography
                    className="body-regular"
                    color={'var(--grey-350)'}
                  >
                    {t('tr_creditHours')}
                  </CustomTypography>

                  <CustomTypography className="h4" color={'var(--grey-350)'}>
                    95
                  </CustomTypography>
                </StyledKeyValueBox>
              </StyledCardContainer>
              <CustomDivider color="var(--accent-200)" />
              <StyledCardContainer>
                <StyledKeyValueBox>
                  <CustomTypography
                    className="body-regular"
                    color={'var(--black)'}
                  >
                    {t('tr_averageMonthlyBibleStudies')}
                  </CustomTypography>
                  <CustomTypography className="h4" color={'var(--black)'}>
                    95
                  </CustomTypography>
                </StyledKeyValueBox>
                <CustomDivider color="var(--accent-200)" dashed />
                <StyledKeyValueBox>
                  <CustomTypography
                    className="body-regular"
                    color={'var(--black)'}
                  >
                    {t('tr_maximumMonthlyBibleStudies')}
                  </CustomTypography>
                  <CustomTypography className="h4" color={'var(--black)'}>
                    95
                  </CustomTypography>
                </StyledKeyValueBox>
              </StyledCardContainer>

              {isPioneer ? (
                <>
                  <CustomDivider color="var(--accent-200)" />
                  <CustomTypography className="h3" color={'var(--black)'}>
                    {t('tr_pioneerServiceStats')}
                  </CustomTypography>

                  <StyledCardContainer>
                    <StyledKeyValueBox>
                      <CustomTypography
                        className="body-regular"
                        color={'var(--black)'}
                      >
                        {t('tr_goalForYear')}
                      </CustomTypography>
                      <CustomTypography className="h4" color={'var(--black)'}>
                        95
                      </CustomTypography>
                    </StyledKeyValueBox>
                    <CustomDivider color="var(--accent-200)" dashed />

                    <StyledKeyValueBox>
                      <CustomTypography
                        className="body-regular"
                        color={'var(--black)'}
                      >
                        {t('tr_hoursLeft')}
                      </CustomTypography>
                      <CustomTypography className="h4" color={'var(--black)'}>
                        95
                      </CustomTypography>
                    </StyledKeyValueBox>
                    <CustomDivider color="var(--accent-200)" dashed />

                    <StyledKeyValueBox>
                      <CustomTypography
                        className="body-regular"
                        color={'var(--black)'}
                      >
                        {t('tr_currentMonthlyGoal')}
                      </CustomTypography>
                      <CustomTypography className="h4" color={'var(--black)'}>
                        95
                      </CustomTypography>
                    </StyledKeyValueBox>
                    <CustomDivider color="var(--accent-200)" dashed />

                    <StyledKeyValueBox>
                      <CustomTypography
                        className="body-regular"
                        color={'var(--black)'}
                      >
                        {t('tr_hoursBalance')}
                      </CustomTypography>
                      <CustomTypography className="h4" color={'var(--black)'}>
                        95
                      </CustomTypography>
                    </StyledKeyValueBox>
                  </StyledCardContainer>
                </>
              ) : null}
            </StyledInfoCard>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
              width: '100%',
              flexGrow: 1,
            }}
          >
            <StyledInfoCard>
              <CustomTypography className="h2" color={'var(--black)'}>
                {t('tr_monthlyHistory')}
              </CustomTypography>

              <StyledCardContainer>
                <CustomDivider color="var(--accent-200)" />
                <MonthItem
                  title={'September 2023'}
                  style="pioneer"
                  comment="I was sick"
                  bibleStudies={10}
                  hours={1}
                  inProgress
                />
                <CustomDivider color="var(--accent-200)" />
                <MonthItem
                  title={'November 2023'}
                  style="publisher"
                  comment="I was sick"
                  bibleStudies={10}
                  hours={1}
                  ministry
                  auxiliaryPioneer
                />
              </StyledCardContainer>
            </StyledInfoCard>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ServiceYear;
