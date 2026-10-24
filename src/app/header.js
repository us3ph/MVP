import { createContext, useContext, useEffect } from 'react';

// Pages publish their title / subtitle to the layout's header.
export const HeaderContext = createContext(() => {});

export function useHeader(title, subtitle) {
  const set = useContext(HeaderContext);
  useEffect(() => {
    set({ title, subtitle });
  }, [set, title, subtitle]);
}
