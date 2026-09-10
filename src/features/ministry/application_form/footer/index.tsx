import { useAppTranslation } from '@hooks/index';
import InfoNote from '@components/info_note';
import Markup from '@components/text_markup';

const FormFooter = () => {
  const { t } = useAppTranslation();

  return (
    <InfoNote>
      <Markup
        content={t('tr_moreInformationForAP')}
        className="body-small-regular"
        color="var(--accent-400)"
        anchorClassName="h4"
      />
    </InfoNote>
  );
};

export default FormFooter;
