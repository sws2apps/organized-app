import { useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

const HOLD_MS = 500;
const MOVE_LIMIT = 10;

export default function usePhoneSelection(
  enabled: boolean,
  onSelect: (id: string) => void
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const origin = useRef<{ x: number; y: number } | undefined>(undefined);
  const held = useRef<string | undefined>(undefined);
  const cancel = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    origin.current = undefined;
  };
  useEffect(() => cancel, [enabled]);
  return {
    consumeClick: (id: string) => {
      const consumed = held.current === id;
      held.current = undefined;
      return consumed;
    },
    handlers: (id: string) =>
      enabled
        ? {
            onPointerDown: (event: PointerEvent<HTMLElement>) => {
              held.current = undefined;
              cancel();
              if (
                !event.isPrimary ||
                event.button !== 0 ||
                (event.target as HTMLElement).closest('button, input, a, label')
              )
                return;
              origin.current = { x: event.clientX, y: event.clientY };
              timer.current = setTimeout(() => {
                held.current = id;
                onSelect(id);
                cancel();
              }, HOLD_MS);
            },
            onPointerMove: (event: PointerEvent<HTMLElement>) => {
              if (
                origin.current &&
                Math.hypot(
                  event.clientX - origin.current.x,
                  event.clientY - origin.current.y
                ) > MOVE_LIMIT
              )
                cancel();
            },
            onPointerUp: cancel,
            onPointerCancel: () => {
              cancel();
              held.current = undefined;
            },
            onPointerLeave: cancel,
            onContextMenu: (event: MouseEvent<HTMLElement>) =>
              event.preventDefault(),
          }
        : {},
  };
}
