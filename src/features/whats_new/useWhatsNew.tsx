import { useEffect, useState } from 'react';
import { SliderCard } from './index.types';

const useWhatsNew = () => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<SliderCard[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const checkReleaseNotes = () => {
      setImages([]);
      setImprovements([]);
      setCurrentImage(0);
      setOpen(true);
    };

    checkReleaseNotes();
  }, []);

  return { open, handleClose, images, improvements, currentImage };
};

export default useWhatsNew;
