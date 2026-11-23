import { atom } from 'jotai';
import { store } from '@states/index';

export type UndoOffer = { text: string; revert: VoidFunction };

export const UNDO_SHOWN_FOR = 8000;

// in an atom, so the offer outlives the page that made it
export const undoOfferState = atom<UndoOffer | undefined>(undefined);

let timer: ReturnType<typeof setTimeout> | undefined;

export const dismissUndo = () => {
  clearTimeout(timer);
  store.set(undoOfferState, undefined);
};

// one at a time: a new offer takes the place of the last
export const offerUndo = (offer: UndoOffer) => {
  clearTimeout(timer);
  store.set(undoOfferState, offer);
  timer = setTimeout(dismissUndo, UNDO_SHOWN_FOR);
};

export const undoLast = () => {
  const offer = store.get(undoOfferState);
  dismissUndo();
  offer?.revert();
};
