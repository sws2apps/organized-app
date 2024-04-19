import { IconDisqualified, IconQualified, IconSave } from '@components/icons';
import Button from '@components/button';
import useAppTranslation from '@hooks/useAppTranslation';
import useButtonActions from './useButtonActions';
import PersonDisqualifyConfirm from '../disqualify';
import PersonQualifyConfirm from '../qualify';

const PersonButtonActions = () => {
  const { t } = useAppTranslation();

  const {
    isNewPerson,
    handleSavePerson,
    handleDisqualify,
    handleDisqualifyCancel,
    handleDisqualifyConfirm,
    isDisqualify,
    isPersonDisqualified,
    handleQualify,
    handleQualifyCancel,
    handleQualifyConfirm,
    isQualify,
  } = useButtonActions();

  return (
    <>
      <PersonDisqualifyConfirm
        open={isDisqualify}
        onClose={handleDisqualifyCancel}
        onConfirm={handleDisqualifyConfirm}
      />

      <PersonQualifyConfirm open={isQualify} onClose={handleQualifyCancel} onConfirm={handleQualifyConfirm} />

      {!isNewPerson && !isPersonDisqualified && (
        <Button variant="secondary" color="red" startIcon={<IconDisqualified />} onClick={handleDisqualify}>
          {t('tr_disqualify')}
        </Button>
      )}

      {!isNewPerson && isPersonDisqualified && (
        <Button variant="secondary" startIcon={<IconQualified />} onClick={handleQualify}>
          {t('tr_qualifyAgain')}
        </Button>
      )}

      <Button variant="main" startIcon={<IconSave />} onClick={handleSavePerson}>
        {t('tr_save')}
      </Button>
    </>
  );
};

export default PersonButtonActions;
