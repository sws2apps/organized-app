import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { LanguageGroupProps } from './index.types';
import useLanguageGroup from './useLanguageGroup';
import GroupDelete from '../group_delete';
import GroupEdit from '../group_edit';
import Typography from '@components/typography';

const LanguageGroup = (props: LanguageGroupProps) => {
  const { t } = useAppTranslation();

  const { group_name, count, language, allowEdit, fullAccess } =
    useLanguageGroup(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing="4px">
        <Typography className="h3">{group_name}</Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {t('tr_personsAmount', { amount: count })}
          {language.length > 0 && ` (${language})`}
        </Typography>
      </Stack>
      {allowEdit && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <GroupEdit group={props.group} />
          {fullAccess && <GroupDelete group={props.group} />}
        </Box>
      )}
    </Box>
  );
};

export default LanguageGroup;
