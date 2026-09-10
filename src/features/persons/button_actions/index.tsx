import { IconDisqualified, IconQualified, IconSave } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useButtonActions from './useButtonActions';
import PersonDisqualifyConfirm from '../disqualify';
import PersonQualifyConfirm from '../qualify';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';

const PersonButtonActions = () => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

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
    isPersonArchived,
  } = useButtonActions();

  return (
    <>
      {isPersonEditor && (
        <NavBarButtonGroup>
          <PersonDisqualifyConfirm
            open={isDisqualify}
            onClose={handleDisqualifyCancel}
            onConfirm={handleDisqualifyConfirm}
          />

          <PersonQualifyConfirm
            open={isQualify}
            onClose={handleQualifyCancel}
            onConfirm={handleQualifyConfirm}
          />

          {!isNewPerson && !isPersonDisqualified && !isPersonArchived && (
            <NavBarButton
              text={t('tr_disqualify')}
              color="red"
              icon={<IconDisqualified />}
              onClick={handleDisqualify}
            ></NavBarButton>
          )}

          {!isNewPerson && isPersonDisqualified && (
            <NavBarButton
              text={t('tr_qualifyAgain')}
              icon={<IconQualified />}
              onClick={handleQualify}
            ></NavBarButton>
          )}

          <NavBarButton
            text={t('tr_save')}
            icon={<IconSave />}
            onClick={handleSavePerson}
          ></NavBarButton>
        </NavBarButtonGroup>
      )}
    </>
  );
};

export default PersonButtonActions;
