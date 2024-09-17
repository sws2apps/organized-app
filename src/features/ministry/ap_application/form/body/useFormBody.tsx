import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { JWLangState } from '@states/app';

const useFormBody = () => {
  const { t } = useAppTranslation();

  const lang = useRecoilValue(JWLangState);

  const moral_text = useMemo(() => {
    let text = t('tr_pioneerApplicationMoral');

    text = text.replace(
      "href=''",
      `href="https://www.jw.org/finder?wtlocale=${lang}&docid=202013206"`
    );

    return text;
  }, []);

  return { moral_text };
};

export default useFormBody;
