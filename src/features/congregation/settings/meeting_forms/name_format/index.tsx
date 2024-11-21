import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { FullnameOption } from '@definition/settings';
import useNameFormat from './useNameFormat';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const NameFormat = () => {
  const { t } = useAppTranslation();

  const { isMidweekEditor, isWeekendEditor, isPublicTalkCoordinator } =
    useCurrentUser();

  const { fullnameOption, handleFullnameOptionChange } = useNameFormat();

  return (
    <Select
      label={t('tr_nameFormat')}
      value={fullnameOption}
      onChange={(e) => handleFullnameOptionChange(+e.target.value)}
      readOnly={
        !isMidweekEditor && !isWeekendEditor && !isPublicTalkCoordinator
      }
    >
      <MenuItem value={FullnameOption.FIRST_BEFORE_LAST}>
        <Typography>{t('tr_formatFirstLast')}</Typography>
      </MenuItem>
      <MenuItem value={FullnameOption.LAST_BEFORE_FIRST}>
        <Typography>{t('tr_formatLastFirst')}</Typography>
      </MenuItem>
    </Select>
  );
};

export default NameFormat;
