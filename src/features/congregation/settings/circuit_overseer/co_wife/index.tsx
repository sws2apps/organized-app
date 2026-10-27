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

  const direction = tablet600Up ? 'row' : 'column';

  // first name leads unless the congregation shows last names first
  const flexDirection =
    fullnameOption === FullnameOption.FIRST_BEFORE_LAST
      ? direction
      : `${direction}-reverse`;

  return (
    <TwoColumnsRow
      sx={{
        flexDirection,
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
