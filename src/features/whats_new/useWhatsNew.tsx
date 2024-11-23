import { useEffect, useRef, useState } from 'react';
import { SwiperRef } from 'swiper/react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { ReleaseNoteType, UpdateStatusType } from '@definition/app';
import { isDemo } from '@constants/index';
import { ImageSlide } from './index.types';
import { appLangState } from '@states/app';

const STORAGE_KEY = 'organized_whatsnew';

const useWhatsNew = () => {
  const { i18n } = useAppTranslation();

  const swiperRef = useRef<SwiperRef>();

  const appLang = useRecoilValue(appLangState);

  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImageSlide[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  const handleClose = () => {
    setOpen(false);

    if (!isDemo) {
      const version = import.meta.env.PACKAGE_VERSION;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ [version]: false }));
    }
  };

  const handleNextAction = () => {
    if (currentImage < images.length - 1) {
      if (swiperRef.current) {
        swiperRef.current.swiper.slideNext();
      }
    }

    if (currentImage === images.length - 1) {
      handleClose();
    }
  };

  const handleBackAction = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleImageChange = (n: number) => {
    setCurrentImage(n);
  };

  useEffect(() => {
    const checkReleaseNotes = () => {
      let showUpdate = true;

      const version = import.meta.env.PACKAGE_VERSION;
      const tmp = localStorage.getItem(STORAGE_KEY);

      if (tmp) {
        const versionData: UpdateStatusType = JSON.parse(tmp);
        const versionInfo = versionData[version];

        showUpdate = versionInfo ?? true;
      }

      if (showUpdate) {
        const releases = i18n.options.resources[appLang]
          .releases as ReleaseNoteType;

        const { improvements, images } = releases[version] || releases['next'];

        const formattedImprovements = Object.values(improvements);
        const formattedImages = Object.values(images);

        setImages(formattedImages);
        setImprovements(formattedImprovements);
        setCurrentImage(0);
        setOpen(true);
      }
    };

    checkReleaseNotes();
  }, [appLang, i18n]);

  useEffect(() => {
    const loadImage = (src: string) =>
      new Promise((resolve) => {
        const preImg = new Image();
        preImg.onload = resolve;
        preImg.src = src;
      });

    const loadImages = async () => {
      const promises = [];

      for (const img of images) {
        const func = loadImage(img.src);
        promises.push(func);
      }

      await Promise.all(promises);

      setIsLoading(false);
    };

    if (images.length > 0) loadImages();
  }, [images]);

  return {
    open,
    handleClose,
    images,
    improvements,
    currentImage,
    handleNextAction,
    handleBackAction,
    isLoading,
    swiperRef,
    handleImageChange,
  };
};

export default useWhatsNew;
