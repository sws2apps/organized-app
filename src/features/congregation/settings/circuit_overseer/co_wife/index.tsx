import { FullnameOption } from '@definition/settings';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { TwoColumnsRow } from '../../shared_styles';
import useCOWife from './useCOWife';
import TextField from '@components/textfield';

const COWife = () => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const { isAdmin } = useCurrentUser();

  const {
    fullnameOption,
    firstname,
    lastname,
    handleFirstnameChange,
    handleLastnameChange,
  } = useCOWife();

  return (
    <TwoColumnsRow
      sx={{
        flexDirection: tablet600Up
          ? fullnameOption === FullnameOption.FIRST_BEFORE_LAST
            ? 'row'
            : 'row-reverse'
          : fullnameOption === FullnameOption.FIRST_BEFORE_LAST
            ? 'column'
            : 'column-reverse',
      }}
    >
      <TextField
        type="text"
        label={t('tr_COWifeFirstname')}
        value={firstname}
        onChange={(e) => handleFirstnameChange(e.target.value)}
        slotProps={{ input: { readOnly: !isAdmin } }}
      />
      <TextField
        type="text"
        label={t('tr_COWifeLastname')}
        value={lastname}
        onChange={(e) => handleLastnameChange(e.target.value)}
        slotProps={{ input: { readOnly: !isAdmin } }}
      />
    </TwoColumnsRow>
  );
};

export default COWife;
