import { createContext, useContext } from 'react';

// Layout-level panels and dialogs any page can open: timeline, mot de passe.
export const UIContext = createContext({ openTimeline: () => {}, openPassword: () => {}, close: () => {} });
export const useUI = () => useContext(UIContext);
