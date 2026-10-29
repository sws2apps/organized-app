import { Fragment } from 'react';
import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import { MicSectionsProps } from './index.types';
import useMicSections from './useMicSections';
import Divider from '@components/divider';
import PersonSelector from '@features/meetings/person_selector';
import Typography from '@components/typography';
import { dutyFieldsLayout } from '@features/meetings/duties_schedule/shared';

const MicSections = ({ week, prefix, meeting }: MicSectionsProps) => {
  const { t } = useAppTranslation();
  const { tabletDown } = useBreakpoints();

  const { sections, emptyHint, parts, sectionParts } = useMicSections(
    week,
    meeting
  );

  return (
    <Stack spacing="16px" sx={{ flex: 1, width: '100%', minWidth: 0 }}>
      {sections.map((section, sectionIndex) => {
        const partsLabel = section.parts.length
          ? sectionParts(section.parts)
          : '';
        const missingParts = section.parts.some(
          (key) => !parts.some((part) => part.key === key)
        );

        return (
          <Fragment key={section.id}>
            {sectionIndex > 0 && <Divider color="var(--accent-200)" />}

            <Stack
              spacing="var(--dialog-header-gap)"
              role="group"
              aria-label={section.name}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: tabletDown ? 'column' : 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 'var(--dialog-header-gap)',
                  paddingBottom: 'var(--radius-s)',
                }}
              >
                <Stack
                  spacing="2px"
                  sx={{ minWidth: 0, flex: 1, overflowWrap: 'anywhere' }}
                >
                  <Typography
                    className="body-small-semibold"
                    sx={{ color: 'var(--grey-400)' }}
                  >
                    {section.name}
                  </Typography>

                  {/* the parts tell the brothers where they are expected, and
                      a section named after its only part says it once */}
                  {missingParts && (
                    <Typography
                      className="label-small-regular"
                      color="var(--orange-dark)"
                    >
                      {t('tr_sectionPartsChanged')}
                    </Typography>
                  )}
                  {partsLabel.length > 0 && partsLabel !== section.name && (
                    <Typography
                      className="label-small-regular"
                      sx={{ color: 'var(--grey-350)' }}
                    >
                      {partsLabel}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Box sx={dutyFieldsLayout(section.amount)}>
                {Array.from(
                  { length: Math.min(section.amount, 4) },
                  (_, index) => (
                    <Box key={index} sx={{ minWidth: 0 }}>
                      <PersonSelector
                        label={t('tr_responsible')}
                        week={week}
                        assignment={`${prefix}_DUTIES_Dynamic`}
                        type={AssignmentCode.DUTIES_Microphone}
                        schedule_id={`${section.id}_${index + 1}`}
                        showIcon={false}
                      />
                    </Box>
                  )
                )}
              </Box>
            </Stack>
          </Fragment>
        );
      })}
      {sections.length === 0 && (
        <Typography className="body-small-regular" color="var(--grey-350)">
          {t(emptyHint)}
        </Typography>
      )}
    </Stack>
  );
};

export default MicSections;
