import { useState } from 'react';
import { NoteFeatureProps } from './index.types';

const useNoteFeature = ({ feature }: NoteFeatureProps) => {
  const [showImage, setShowImage] = useState(Boolean(feature.src));

  const handleImageError = () => setShowImage(false);

  return { showImage, handleImageError };
};

export default useNoteFeature;
