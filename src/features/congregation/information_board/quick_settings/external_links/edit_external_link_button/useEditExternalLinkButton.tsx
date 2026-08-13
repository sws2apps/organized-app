import { ExternalLinkType } from '@definition/information_board';
import { useCallback, useEffect, useState } from 'react';
import { labelIsCorrect, linkIsCorrect } from '../../index.utils';

const useEditExternalLinkButton = (props: ExternalLinkType) => {
  const [labelError, setLabelError] = useState('');
  const [linkError, setLinkError] = useState('');

  const validateLabel = useCallback(() => {
    return labelIsCorrect(props.label)
      ? setLinkError('')
      : setLabelError('tr_maximum25characters');
  }, [props.label]);

  const validateLink = useCallback(() => {
    return linkIsCorrect(props.link)
      ? setLinkError('')
      : setLinkError('tr_invalidLink');
  }, [props.link]);

  useEffect(() => {
    validateLabel();
    validateLink();
  }, [props.label, validateLabel, validateLink]);

  return {
    labelError,
    linkError,
  };
};

export default useEditExternalLinkButton;
