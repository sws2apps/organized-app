import { useEffect, useRef, useState } from 'react';
import { ClickerModeProps, ClickerSaveValues, ClickerTab } from './index.types';
import { haptic } from '@services/haptics';

type TabState<T> = Record<ClickerTab, T>;

const MAX_COUNT = 1914;

// Matches the reset-arrow spin transition.
const RESET_SPIN_MS = 500;

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
  const [resetting, setResetting] = useState(false);
  const [shakeSignal, setShakeSignal] = useState(0);

  const wasOpen = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (open && !wasOpen.current) {
      setTab(initialTab);
      setCounts({ present: presentValue, online: onlineValue });
      setTouched({ present: false, online: false });
      setResetSpin(0);
      setResetting(false);
      setShakeSignal(0);
      clearTimeout(resetTimer.current);
    }

    wasOpen.current = open;
  }, [open, initialTab, presentValue, onlineValue]);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const count = counts[tab];

  const markTouched = () => {
    setTouched((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
  };

  const handleIncrement = () => {
    if (count >= MAX_COUNT) {
      setShakeSignal((prev) => prev + 1);
      haptic('limit');
      return;
    }

    setCounts((prev) => ({ ...prev, [tab]: Math.min(MAX_COUNT, prev[tab] + 1) }));
    markTouched();
    haptic('tap');
  };

  const handleDecrement = () => {
    if (count === 0) return;

    setCounts((prev) => ({ ...prev, [tab]: Math.max(0, prev[tab] - 1) }));
    markTouched();
    haptic('tap');
  };

  const handleReset = () => {
    setCounts((prev) => ({ ...prev, [tab]: 0 }));
    markTouched();
    setResetSpin((prev) => prev + 1);
    haptic('reset');

    setResetting(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setResetting(false), RESET_SPIN_MS);
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
    resetting,
    shakeSignal,
    handleIncrement,
    handleDecrement,
    handleReset,
    handleSave,
  };
};

export default useClickerMode;
