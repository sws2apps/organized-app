import { Box } from '@mui/material';
import { MeetingPartType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMeetingPart from './useMeetingPart';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const MeetingPart = (props: MeetingPartType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    source,
    secondary,
    secondaryOverwrite,
    sourceOverwrite,
    handleSourceOverwriteSave,
    handleSourceOverwriteChange,
    handleSecondaryOverwriteChange,
    handleSecondaryOverwriteSave,
  } = useMeetingPart(props);

  return (
    <>
      {props.isEdit && props.isOverwrite && (
        <>
          <TextField
            sx={{ flex: tabletDown ? 'unset' : 1 }}
            label={t('tr_title')}
            value={sourceOverwrite}
            onChange={(e) => handleSourceOverwriteChange(e.target.value)}
            onKeyUp={handleSourceOverwriteSave}
          />
          {props.type !== 'lc_cbs' && (
            <TextField
              sx={{ width: '100%' }}
              label={t('tr_sourceMaterial')}
              value={secondaryOverwrite}
              onChange={(e) => handleSecondaryOverwriteChange(e.target.value)}
              onKeyUp={handleSecondaryOverwriteSave}
            />
          )}
        </>
      )}
      {(!props.isEdit || !props.isOverwrite) && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography className="h4" color={props.color}>
            {source}
          </Typography>
          {secondary && (
            <Typography className="body-small-regular" color="var(--grey-400)">
              {secondary}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};

export default MeetingPart;
