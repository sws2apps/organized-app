import { useEffect, useMemo, useRef, useState } from 'react';
import { SwiperRef } from 'swiper/react';
import { useAppTranslation } from '@hooks/index';
import { ReleaseNoteType, UpdateStatusType } from '@definition/app';
import { isTest } from '@constants/index';
import { ImageSlide } from './index.types';
import { getAppLang } from '@services/app';

const STORAGE_KEY = 'organized_whatsnew';

const appLang = getAppLang();

const useWhatsNew = () => {
  const { i18n } = useAppTranslation();

  const swiperRef = useRef<SwiperRef>(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImageSlide[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  const releases = useMemo(() => {
    return i18n.options.resources[appLang].releases as ReleaseNoteType;
  }, [i18n]);

  const version = useMemo(() => {
    // notes for a release still to come are already translated, but announcing
    // them before that date would describe an app the user does not have yet
    const today = new Date().toISOString().slice(0, 16);

    return Object.keys(releases)
      .filter((releaseDate) => releaseDate <= today)
      .sort()
      .reverse()
      .at(0);
  }, [releases]);

  const handleClose = () => {
    setOpen(false);

    if (!isTest && version) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const lsVersion = (saved ? JSON.parse(saved) : {}) as UpdateStatusType;

      lsVersion[version] = false;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(lsVersion));
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
      // every release is still ahead: nothing to announce on this device
      if (!version) return;

      let showUpdate = true;

      const tmp = localStorage.getItem(STORAGE_KEY);

      if (tmp) {
        const versionData: UpdateStatusType = JSON.parse(tmp);
        const versionInfo = versionData[version];

        showUpdate = versionInfo ?? true;
      }

      if (showUpdate) {
        const { improvements, images } = releases[version];

        if (improvements) {
          const formattedImprovements = Object.values(improvements);
          setImprovements(formattedImprovements);
        }

        if (images) {
          const formattedImages = Object.values(images);
          setImages(formattedImages);
          setCurrentImage(0);
        }

        setOpen(true);
      }
    };

    checkReleaseNotes();
  }, [i18n, version, releases]);

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

    if (images.length === 0) setIsLoading(false);
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
