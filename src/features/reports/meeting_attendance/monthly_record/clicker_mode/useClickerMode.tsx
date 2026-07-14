import { useEffect, useRef, useState } from 'react';
import { ClickerModeProps, ClickerSaveValues, ClickerTab } from './index.types';

type TabState<T> = Record<ClickerTab, T>;

// Real attendance counts top out in the low hundreds; the ceiling is an
// easter egg — 1914, the Kingdom year. Try to go past it and it shakes "no".
const MAX_COUNT = 1914;

/**
 * Encapsulates the clicker session state: an independent count per tab, which
 * tabs the user has interacted with, and the save / cancel behavior.
 *
 * Each session starts fresh from zero; only tabs the user actually adjusts are
 * written back, so opening the clicker never clobbers an untouched value.
 */
const useClickerMode = ({
  open,
  onClose,
  initialTab,
  presentValue,
  onlineValue,
  onSave,
}: Pick<
  ClickerModeProps,
  'open' | 'onClose' | 'initialTab' | 'presentValue' | 'onlineValue' | 'onSave'
>) => {
  const [tab, setTab] = useState<ClickerTab>(initialTab);
  const [counts, setCounts] = useState<TabState<number>>({
    present: presentValue,
    online: onlineValue,
  });
  const [touched, setTouched] = useState<TabState<boolean>>({
    present: false,
    online: false,
  });
  const [resetSpin, setResetSpin] = useState(0);
  const [shakeSignal, setShakeSignal] = useState(0);

  const wasOpen = useRef(false);

  // Start each session from the values already in the fields, on the focused
  // tab. Only seed on the opening transition so a later focus change (e.g. the
  // dialog trapping focus) doesn't wipe an in-progress count.
  useEffect(() => {
    if (open && !wasOpen.current) {
      setTab(initialTab);
      setCounts({ present: presentValue, online: onlineValue });
      setTouched({ present: false, online: false });
      setResetSpin(0);
      setShakeSignal(0);
    }

    wasOpen.current = open;
  }, [open, initialTab, presentValue, onlineValue]);

  const count = counts[tab];

  const markTouched = () => {
    setTouched((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
  };

  const handleIncrement = () => {
    // At the ceiling the increment is refused — shake instead of counting.
    if (count >= MAX_COUNT) {
      setShakeSignal((prev) => prev + 1);
      return;
    }

    setCounts((prev) => ({ ...prev, [tab]: Math.min(MAX_COUNT, prev[tab] + 1) }));
    markTouched();
  };

  const handleDecrement = () => {
    setCounts((prev) => ({ ...prev, [tab]: Math.max(0, prev[tab] - 1) }));
    markTouched();
  };

  const handleReset = () => {
    setCounts((prev) => ({ ...prev, [tab]: 0 }));
    markTouched();
    setResetSpin((prev) => prev + 1);
  };

  const handleSave = () => {
    const values: ClickerSaveValues = {};

    if (touched.present) values.present = counts.present;
    if (touched.online) values.online = counts.online;

    onSave(values);
    onClose();
  };

  return {
    tab,
    setTab,
    count,
    touched: touched[tab],
    resetSpin,
    shakeSignal,
    handleIncrement,
    handleDecrement,
    handleReset,
    handleSave,
  };
};

export default useClickerMode;
